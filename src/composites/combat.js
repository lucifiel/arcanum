import { assign } from 'objecty';

import Events, {
	EVT_COMBAT, ENEMY_SLAIN, ALLY_DIED,
	DAMAGE_MISS, CHAR_DIED, STATE_BLOCK
} from '../events';

import { itemRevive } from '../modules/itemgen';
import { NO_SPELLS } from '../chars/states';

import { TEAM_PLAYER, getDelay, TEAM_NPC, TEAM_ALL } from '../values/consts';
import { TARGET_ENEMY, TARGET_ALLY, TARGET_SELF,
	TARGET_RAND, TARGET_PRIMARY, ApplyAction, TARGET_GROUP, TARGET_ANY } from "../values/combatVars";
import Npc from '../chars/npc';


/**
 * @const {number} DEFENSE_RATE - rate defense is multiplied by before tohit computation.
 */
const DEFENSE_RATE = 0.25;

export default class Combat {

	toJSON() {

		var a = undefined;
		if ( this.allies.length > 1 ) {

			a = [];
			for( let i = 1; i < this.allies.length; i++ ) {
				var v = this.allies[i];
				a.push( v.keep ? v.id : v )
			}

		}

		return {
			enemies: this._enemies,
			allies:a
		}

	}

	/**
	 * @property {Npc[]} enemies - enemies in the combat.
	 */
	get enemies() { return this._enemies; }
	set enemies(v) {this._enemies = v;}

	/**
	 * @property {Char[]} allies - player & allies.
	 */
	get allies() { return this._allies; }
	set allies(v) { this._allies = v; }

	get done() { return this._enemies.length === 0; }

	/**
	 * @property {Char[][]} teams - maps team id to team list.
	 */
	get teams(){ return this._teams; }

	constructor(vars = null) {

		if (vars) assign(this, vars);

		if (!this.enemies) this.enemies = [];
		if ( !this.allies) this.allies = [];

		this._teams = [];

	}

	revive(gs) {

		this.state = gs;
		this.player = gs.player;

		// splices done in place to not confuse player with changed order.

		let it;

		for( let i = this._enemies.length-1; i>=0; i-- ) {

			// data can be null both before and after itemRevive()
			it = this._enemies[i];
			if ( it ) {
				it = this._enemies[i] = itemRevive( gs, it );
			}
			if ( !it || !(it instanceof Npc) ) {
				this._enemies.splice(i,1);
			}


		}

		for( let i = this._allies.length-1; i>=0; i-- ) {

			it = this._allies[i];
			if ( typeof it === 'string' ) this._allies[i] = gs.minions.find( it );
			else if ( it && typeof it === 'object' && !(it instanceof Npc)) {
				console.log('NEW COMBAT ALLY');
				this._allies[i] = itemRevive( gs, it );
			}

			if ( !this._allies[i] ) this._allies.splice(i,1);

		}

		this._allies.unshift( this.player );

		this.refreshTeamArrays();

		Events.add( CHAR_DIED, this.charDied, this );

	}

	/**
	 * Add Npc to the combat
	 * @param {Npc} it
	 */
	addNpc( it ){

		it.timer = getDelay( it.speed );

		if ( it.team === TEAM_PLAYER ) {
			this._allies.push( it)
		} else this._enemies.push(it);

	}

	update(dt) {

		if ( this.player.alive === false ) return;

		var e, action;
		for( let i = this._allies.length-1; i >= 0; i-- ) {

			e = this._allies[i];
			if ( e.alive === false ) {

				/** @todo messy minion removal. */
				e.hp -= dt;
				if ( e.hp < -5 ) {
					this._allies.splice(i,1);
				}
				continue;

			}

			if ( e !==this.player) e.update(dt);
			action = e.combat(dt);
			if ( !action ) continue;

			else if ( !action.canAttack() ) {
				Events.emit( STATE_BLOCK, e, action );
			} else this.attack( e, action );

		}

		for( let i = this._enemies.length-1; i >= 0; i-- ) {

			e = this._enemies[i];
			e.update(dt);
			if ( e.alive === false ) { this._enemies.splice(i,1); continue;}
			action = e.combat(dt);
			if ( !action ) continue;

			else if ( !action.canAttack() ){
				Events.emit( STATE_BLOCK, e, action );
			} else this.attack( e, action );

		}

	}

	/**
	 * Player-casted spell or action attack.
	 * @param {Item} it
	 * @param {Context} g
	 */
	spellAction( it, g ) {

		if ( this._enemies.length===0 ) {

			Events.emit(EVT_COMBAT, null, g.self.name + ' casts ' + it.name + ' at the darkness.' );

		} else {


			let a = g.self.getCause( NO_SPELLS);
			if ( a ) {

				//console.warn('SPELLS blocked: ' + a );
				Events.emit( STATE_BLOCK, g.self, a );

			} else {
				Events.emit(EVT_COMBAT, null, g.self.name + ' casts ' + it.name );
				if ( it.attack ) this.attack( g.self, it.attack );
				else {
					console.log('spell no attack: ' + it.id );
				}
			}

		}

	}

	/**
	 * Attack a target.
	 * @param {Char} attacker - enemy attacking.
	 * @param {Object|Char} atk - attack object.
	 */
	attack( attacker, atk ) {

		if ( atk.log ) {
			Events.emit( EVT_COMBAT, null, atk.log );
		}

		if ( atk.hits ) {
			let len = atk.hits.length;
			for( let i = 0; i < len; i++ ) {
				this.attack( attacker, atk.hits[i] );
			}
		}

		let targ = this.getTarget( attacker, atk.targets );
		if ( !targ) return;

		if ( atk.name === 'rewind' || atk.name ==='recoil') {
			console.log( atk.name + ' targ: ' + targ.name + ' TARG: ' + atk.targets);
		}

		if ( Array.isArray(targ)) {

			for( let i = targ.length-1; i>= 0; i-- ) {
				this.doAttack( attacker, atk, targ[i]);
			}

		} else this.doAttack( attacker, atk, targ );

	}

	/**
	 *
	 * @param {Char} attacker
	 * @param {Attack} atk
	 * @param {Char} targ
	 */
	doAttack( attacker, atk, targ ) {

		if (!targ || !targ.alive ) return;

		if ( atk.harmless || !targ.canDefend() || this.tryHit( attacker, targ, atk ) ) {
			ApplyAction( targ, atk, attacker );
		}

	}

	/**
	 * @param {Char} char
	 * @param {string} targets
	 * @returns {Char|Char[]|null}
	 */
	getTarget( char, targets ) {

		// retarget based on state.
		targets = char.getTarget(targets);

		var group = this.getGroup( targets, char.team );
		if ( targets & TARGET_GROUP ) return group;

		if ( !targets || targets === TARGET_ENEMY || targets === TARGET_ALLY ) {
			return this.randTarget(group);
		} else if ( targets & TARGET_SELF ) return char;

		if ( targets & TARGET_PRIMARY) return this.primeTarget(group);
		if ( targets & TARGET_RAND ) return this.randTarget(group);

	}

	/**
	 * Get the Char group to which the target flags can apply.
	 * Null or zero targets are assumed an enemy target.
	 * @param {number} targets
	 * @param {number} team - ally team.
	 */
	getGroup( targets, team ) {

		if ( !targets || (targets & TARGET_ENEMY) ) {

			return team === TEAM_PLAYER ? this.enemies : this.allies;

		} else if ( targets & (TARGET_ALLY+TARGET_SELF) ) {
			return this.teams[team];

		} else if ( targets & TARGET_ANY ) return this.teams[TEAM_ALL];
		else if ( targets & TARGET_RAND ) {
			return Math.random() < 0.5 ? this.allies : this.enemies;
		}
		return null;

	}

	randTarget(a) {
		return a[Math.floor( Math.random()*a.length)];
	}

	/**
	 * Returns the most-primary ( lowest index) target.
	 * @param {*} a
	 */
	primeTarget(a){
		for( let i = 0; i<a.length; i++ ) {
			if ( a[i].alive ) return a[i];
		}
	}

	/**
	 * @returns {Char} rand attack target
	 */
	nextTarget( a ) {

		for( let i = a.length-1; i>=0; i-- ) {
			if ( a[i].alive ) return a[i];
		}
	}

	/**
	 * Rolls an attack roll against a defender.
	 * @param {Char} attacker - attack object
	 * @param {Char} defender - defending char.
	 * @param {Object} attack - attack or weapon used to hit.
	 * @returns {boolean} true if char hit.
	 */
	tryHit( attacker, defender, attack ){

		let tohit = attacker.getHit();

		if ( attack && (attack != attacker) ) tohit += ( attack.tohit || 0 );

		if ( this.dodgeRoll( defender.dodge, tohit )) {

			Events.emit( DAMAGE_MISS, defender.name + ' dodges ' + (attack.name||attacker.name));

		} else if ( Math.random()*( 10 + tohit ) >= Math.random()*(10 + defender.defense * DEFENSE_RATE ) ) {
			return true;
		} else {

			Events.emit( DAMAGE_MISS, defender.name + ' parries ' + (attack.name||attacker.name));
		}

	}

	/**
	 *
	 * @param {Npc[]} enemies
	 */
	setEnemies( enemies ) {

		this.enemies.push.apply( this.enemies, enemies );
		//	this.enemies.push.apply( this.enemies, enemies );

		if ( enemies.length>0 ){

			if ( enemies[0] ) Events.emit( EVT_COMBAT, enemies[0].name + ' Encountered' );
			else console.warn('No valid enemy');

		}

		this.refreshTeamArrays();
		this.setTimers();

	}

	refreshTeamArrays() {

		this.teams[TEAM_PLAYER] = this.allies;
		this.teams[TEAM_NPC] = this.enemies;
		this.teams[TEAM_ALL] = this.allies.concat(this.enemies);

	}

	/**
	 * Reenter same dungeon.
	 */
	reenter() {
		this.allies = this.state.minions.allies.toArray();
		this.allies.unshift( this.player );
		this.refreshTeamArrays();
	}

	/**
	 * Begin new dungeon.
	 */
	begin() {

		this._enemies.splice(0, this.enemies.length);
		this.reenter();

	}


	/**
	 * readjust timers at combat start to the smallest delay.
	 * prevents waiting for first attack.
	 */
	setTimers() {

		let minDelay = this.player.timer = getDelay( this.player.speed );

		var t;
		for( let i = this.enemies.length-1; i >= 0; i-- ) {
			t = this.enemies[i].timer = getDelay( this.enemies[i].speed );
			if ( t < minDelay ) minDelay = t;
		}
		for( let i = this.allies.length-1; i >= 0; i-- ) {
			t = this.allies[i].timer = getDelay( this.allies[i].speed );
			if ( t < minDelay ) minDelay = t;
		}

		// +1 initial encounter delay.
		minDelay -= 1;

		this.player.timer -= minDelay;


		for( let i = this.enemies.length-1; i >= 0; i-- ) {
			this.enemies[i].timer -= minDelay;
		}
		for( let i = this.allies.length-1; i >= 0; i-- ) {
			this.allies[i].timer -= minDelay;
		}

	}

	/**
	 * exponentially decreasing function. Lower is better.
	 * e^(-1/100) approx 99% (not to dodge)
	 * 1/e = 37% - might be too low.
	 * @param {number} dodge
	 * @param {number} tohit
	 * @returns {boolean} true if defender dodges.
	 */
	dodgeRoll( dodge, tohit ) {

		// higher x === better dodge.
		let x = ( tohit > dodge ? 1 : dodge - tohit )/16;

		return Math.random() > ( Math.exp( -x*x ) );

	}

	charDied( char, attacker ) {

		if ( char === this.player ) return;
		else if ( char.team === TEAM_PLAYER ) {

			Events.emit( ALLY_DIED, char );

		} else Events.emit( ENEMY_SLAIN, char, attacker );

	}

}