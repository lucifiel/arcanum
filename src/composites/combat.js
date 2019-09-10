import Events from '../events';

import Game from '../game';
import Range from '../range';
import Dot from '../chars/dot';
import Npc from '../chars/npc';

import {
	EVT_COMBAT, ENEMY_SLAIN, PLAYER_SLAIN,
	DAMAGE_MISS, ENEMY_HIT, PLAYER_HIT
} from '../events';

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
		let dmg = getDamage(attack.damage) +
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
* @param {number|function|Range} dmg /
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

		for (let i = v.length - 1; i >= 0; i--) if ( !( v[i] instanceof Npc ) ) v[i] = new Npc( v[i] );
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
		this._allies = this._allies || [];

	}

	revive(state) {

		this.state = state;
		this.player = state.player;

		for( let i = this._enemies.length-1; i>=0; i-- ) this._enemies[i].revive(state);
		for( let i = this._allies.length-1; i >= 0; i-- ) this._allies[i].revive(state);

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

				this.allyAttack( this.player, this.player.weapon||this.player.baseAttack );

			}

		}

		var e, action;
		for( let i = this._allies.length-1; i >= 0; i-- ) {

			e = this._allies[i];
			if ( e.alive === false ) { this._allies.splice(i,1); continue;}
			action = e.update(dt);
			if ( action ) this.allyAttack( e, action );

		}

		for( let i = this._enemies.length-1; i >= 0; i-- ) {

			e = this._enemies[i];
			if ( e.alive === false ) { this._enemies.splice(i,1); continue;}
			action = e.update(dt);
			if ( action ) this.enemyAttack( e, action, this.player );

		}

	}

	/**
	 * Player-casted spell or action attack.
	 * @param {Item} it
	 */
	spellAttack( it ) {

		//console.log('spell attack');
		if ( this._enemies.length===0 ) {

			Events.dispatch(EVT_COMBAT, null, this.player.name + ' casts ' + it.name + ' at the darkness.' );

		} else this.allyAttack( it );

	}

	/**
	 *
	 * @param {Item} src - attack source. (spell,weapon,etc.)
	 */
	allyAttack( attacker, src ) {

		let atk = src ? src.attack : attacker.attack;

		let e = this.enemies[0];

		if ( this.tryHit( attacker, e, atk ) ) {

			if ( tryDamage( e, atk, attacker ) ) if ( e.hp <= 0 ) this.enemyDied( e, attacker );

		}

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

		if (  Array.isArray(enemy)){

			let enemyList = [];

			for( let i = enemy.length-1; i >=0; i-- ) {
				var e = enemy[i];
				if ( typeof e === 'string' ) e = Game.getData(e);
				enemies.push( e );

				enemyList.push( e.name);
			}

			Events.dispatch( EVT_COMBAT, enemyList.join(',') + ' Encountered' );

		} else {

			if ( typeof enemy === 'string' ) enemy = Game.getData( enemy );
			if ( !enemy) {console.warn( 'Missing Enemy'); return }
			enemies.push( enemy );

			Events.dispatch( EVT_COMBAT, enemy.name + ' Encountered' );
		}

		this.enemies = enemies;

	}

	/**
	 * Clear the current combat encounter.
	 */
	clear() {
		this._enemies = [];
	}

	dodgeRoll( dodge, tohit ) {

		let x = ( tohit > dodge ? 1 : dodge - tohit )/10;
		return ( Math.exp( -x*x ) );

	}

	charDied( char, attacker ) {

		if ( char === this.player ) this.playerDied();

	}

	enemyDied( char, attacker ) {
		Events.dispatch( ENEMY_SLAIN, char, attacker );
	}

	playerDied() {
		Events.dispatch( PLAYER_SLAIN, null );
		Game.setAction( this.state.restAction );
	}

}