import Game from '../game';
import Range from '../range';
import Dot from '../chars/dot';
import Npc, { ALLY } from '../chars/npc';

import Events, {
	EVT_COMBAT, ENEMY_SLAIN, PLAYER_SLAIN, ALLY_DIED,
	DAMAGE_MISS, ENEMY_HIT, PLAYER_HIT
} from '../events';

import Monster from '../items/monster';

/**
* Attempt to damage a target. Made external for use by dots, other code.
* @param {Char} target
* @param {Object} attack
*/
export function tryDamage(target, attack, attacker = null) {

	if (attack.kind) {

		if (target.isImmune(attack.kind)) {

			Events.dispatch(DAMAGE_MISS, target.name + ' is immune to ' + attack.kind);

			return false;
		}

	}
	if (attack.damage) {

		// add optional base damage from attacker.
		let dmg = attack.getDamage() +
			((attacker && (attacker !== attack) && attacker.damage) ?
				getDamage(attacker.damage) : 0);

		let resist = target.getResist(attack.kind);
		if (resist > 0) {

			dmg *= (1 - resist);
		}

		target.hp -= dmg;

		var attackName = attack.name || (attacker ? attacker.name : '');
		Events.dispatch(EVT_COMBAT, null, target.name + ' hit' +
			(attackName ? ' by ' + attackName : '') +
			': ' + dmg.toFixed(1));

		if (attack.leech && attacker) {
			let amt = Math.floor(100 * attack.leech * dmg) / 100;
			attacker.hp += amt;
			Events.dispatch(EVT_COMBAT, null, attacker.name + ' steals ' + amt + ' life.');
		}

	}

	if (attack.dot) {
		target.addDot(new Dot(attack.dot, attacker, attack.name));
	}

	return true;

}

export function applyDamage(target, attack, attacker = null) {
}

/**
* Convert damage object to raw damage value.
* @param {number|function|Range|Attack} dmg /
*/
export function getDamage(dmg) {

	if (dmg instanceof Range) return dmg.value;
	else if (!isNaN(dmg)) return Number(dmg);
	console.log('Damage undefined: ' + dmg);
	return 0;

	// TODO: invalid
	//else return dmg( this.state, this.player, this.enemy );

}

export default class Combat {

	toJSON() {

		return {
			enemies: this._enemies,
			allies: this.allies,
		}

	}

	/**
	 * @property {Npc[]} enemies - enemies in the combat.
	 */
	get enemies() { return this._enemies; }
	set enemies(v) {

		for (let i = v.length - 1; i >= 0; i--) {

			var obj = v[i];
			if ( obj instanceof Monster ) v[i] = Game.itemGen.npc( obj);
			else if (!(obj instanceof Npc) ) v[i] = new Npc( v[i] );

		}

		this._enemies = v;
	}

	/**
	 * @property {Npc[]} allies - creatures fighting for player.
	 */
	get allies() { return this._allies; }
	set allies(v) { this._allies = v; }

	get complete() { return this._enemies.length === 0; }

	constructor(vars = null) {

		if (vars) Object.assign(this, vars);

		this._enemies = this._enemies || [];

	}

	revive(state) {

		this.state = state;
		this.player = state.player;

		for( let i = this._enemies.length-1; i>=0; i-- ) this._enemies[i].revive(state);

		this.allies = state.minions.active;

	}

	update(dt) {

		if ( this._enemies.length === 0 ) return;

		this.player.timer -= dt;
		if ( this.player.alive === false ) {
			this.playerDied();
			return;
		}
		if ( this.player.timer <= 0 ) {

			this.player.timer += this.player.delay;

			// attempt to use primary item attack first.
			if ( !this.player.primary || !Game.tryItem( this.player.primary )) {

				this.allyAttack( this.player, this.player.weapon||this.player.baseWeapon );

			}

		}

		var e, action;
		for( let i = this._allies.length-1; i >= 0; i-- ) {

			e = this._allies[i];
			if ( e.alive === false ) {
				this.charDied( e );
				continue;
			}
			action = e.update(dt);
			if ( action ) this.allyAttack( e, action );

		}

		for( let i = this._enemies.length-1; i >= 0; i-- ) {

			e = this._enemies[i];
			if ( e.alive === false ) { this._enemies.splice(i,1); continue;}
			action = e.update(dt);
			if ( action ) this.enemyAttack( e, action, this.nextAlly() );

		}

	}

	/**
	 * @returns {Npc} next target of an enemy attack
	 */
	nextAlly() {

		let len = this._allies.length;

		//console.log('allies: ' + len );

		for( let i = 0; i < len; i++ ) {
			if ( this._allies[i].alive ) return this._allies[i];
		}
		return this.player;
	}

	/**
	 * Player-casted spell or action attack.
	 * @param {Item} it
	 */
	spellAttack( it ) {

		//console.log('spell attack');
		if ( this._enemies.length===0 ) {

			Events.dispatch(EVT_COMBAT, null, this.player.name + ' casts ' + it.name + ' at the darkness.' );

		} else this.allyAttack( this.player, it );

	}

	/**
	 *
	 * @param {Item} src - attack source. (spell,weapon,etc.)
	 */
	allyAttack( attacker, src ) {

		let atk = src ? (src.attack||src) : attacker.attack;

		if ( atk.targets === 'all') {

			for( let i = this.enemies.length-1; i>= 0; i-- ) {
				this.doAttack(attacker, atk, this.enemies[i]);
			}

		} else this.doAttack( attacker, atk, this.enemies[0] );

	}

	/**
	 *
	 * @param {Char} enemy - enemy attacking.
	 * @param {Object|Char} attack - attack object.
	 * @param {Char} target - target of attack. ( currently player ).
	 */
	enemyAttack( enemy, attack, target ) {

		if ( Array.isArray(attack) ) {
			attack.forEach(v=>this.enemyAttack(enemy,v,target), this);
			return;
		}

		if ( this.tryHit( enemy, target, attack ) ) {

			if ( tryDamage( target, attack, enemy ) ) if ( target.hp <= 0 ) this.charDied( target );

		}

	}

	/**
	 *
	 * @param {Char} attacker
	 * @param {Attack} atk
	 * @param {Char} targ
	 */
	doAttack( attacker, atk, targ ) {

		if ( this.tryHit( attacker, targ, atk ) ) {
			if ( tryDamage( targ, atk, attacker ) ) if ( targ.hp <= 0 ) this.charDied( targ, attacker );
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

		let tohit = attacker.tohit || 0;
		if ( attack && (attack != attacker) ) tohit += ( attack.tohit || 0 );

		if ( Math.random() >  this.dodgeRoll( defender.dodge, tohit )) {

			Events.dispatch( DAMAGE_MISS, defender.name + ' dodges ' + (attack.name||attacker.name));
			return false;
		}

		//console.log( attacker.name + ': ' + tohit + '  vs: ' + defender.defense );
		if ( Math.random()*( 10 + tohit ) >= Math.random()*(10 + defender.defense ) ) return true;

		Events.dispatch( DAMAGE_MISS, attacker.name + ' misses' );
		return false;

	}

	setEnemies( enemy ) {

		var enemies = [];
		var e;

		if (  Array.isArray(enemy)){

			for( let i = enemy.length-1; i >=0; i-- ) {
				e = enemy[i];
				if ( typeof e === 'string' ) e = Game.getData(e);
				enemies.push( e );

			}


		} else {

			e = typeof enemy === 'string' ? Game.getData(enemy) : enemy;
			if ( !e) {console.warn( 'Missing Enemy: ' + enemy ); return }

			enemies.push( e );

		}

		if ( enemies.length>0) Events.dispatch( EVT_COMBAT, enemies[0].name + ' Encountered' );

		this.enemies = enemies;

	}

	/**
	 * Clear the current combat encounter.
	 */
	clear() { this._enemies = []; }

	dodgeRoll( dodge, tohit ) {

		let x = ( tohit > dodge ? 1 : dodge - tohit )/10;
		return ( Math.exp( -x*x ) );

	}

	charDied( char, attacker ) {

		console.log('char died: ' + char.id );
		if ( char === this.player ) this.playerDied();
		else if ( char.team === ALLY ) {

			Events.dispatch( ALLY_DIED, char );

		} else Events.dispatch( ENEMY_SLAIN, char, attacker );

	}

	playerDied() {
		Events.dispatch( PLAYER_SLAIN, null );
		Game.setAction( this.state.restAction );
	}

}