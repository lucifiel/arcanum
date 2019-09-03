import Events from '../events';

import Game from '../game';
import Char from '../chars/char';
import Range from '../range';
import Dot from '../chars/dot';
import Npc from '../chars/npc';
import Inventory from '../chars/inventory';

import { EVT_COMBAT, ENEMY_SLAIN, PLAYER_SLAIN,
		DAMAGE_MISS, ENEMY_HIT, PLAYER_HIT } from '../events';

/**
* Attempt to damage a target. Made external for use by dots, other code.
* @param {Char} target
* @param {Object} attack
*/
export function tryDamage( target, attack, attacker=null ) {

	if ( attack.kind ) {

		if ( target.isImmune(attack.kind) ) {

			Events.dispatch( DAMAGE_MISS, target.name + ' is immune to ' + attack.kind );

			return false;
		}
		if ( target.tryResist(attack.kind) ) {

			Events.dispatch( DAMAGE_MISS, target.name + ' resists ' + attack.kind )
			return false;
		}

	}
	if ( attack.damage ) {

		// add optional base damage from attacker.
		let dmg = getDamage( attack.damage ) +
		( ( attacker && (attacker !== attack) && attacker.damage ) ?
			getDamage(attacker.damage) : 0 );

		target.hp -= dmg;

		var attackName = attack.name || ( attacker ? attacker.name : '' );
		Events.dispatch( EVT_COMBAT, null, target.name + ' hit' +
			( attackName ? ' by ' + attackName : '' ) +
			': ' + dmg.toFixed(1) );

		if ( attack.leech && attacker ) {
			let amt = Math.floor( 100*attack.leech*dmg )/100;
			attacker.hp += amt;
			Events.dispatch( EVT_COMBAT, null, attacker.name + ' steals ' + amt + ' life.' );
		}

	}

	if ( attack.dot ) {
		target.addDot( new Dot( attack.dot, attacker, attack.name ) );
	}

	return true;

}

/**
* Convert damage object to raw damage value.
* @param {number|function|Range} dmg /
*/
export function getDamage( dmg ) {

	if ( dmg instanceof Range) return dmg.value;
	else if ( !isNaN(dmg) ) return Number(dmg);
	console.log('Damage undefined: ' + dmg );
	return 0;

	// TODO: invalid
	//else return dmg( this.state, this.player, this.enemy );

}

/**
 * Represents an active dungeon raid.
 */
export default class Raid {

	/**
	 * @property {string} id - id of dungeon in progress.
	 */
	get id() { return this.dungeon.id;}

	/**
	 * @property {string} name - name of dungeon in progress.
	 */
	get name() { return this.dungeon.name; }

	get cost() { return this.dungeon ? this.dungeon.cost : null; }
	get run() { return this.dungeon ? this.dungeon.run : null; }

	get progress(){ return this.dungeon.progress; }
	set progress(v){

		if ( v >= this.dungeon.length ) {
			this.raidDone( this.dungeon );
		} else this.dungeon.progress=v;

	}

	percent() { return this.dungeon.percent(); }
	maxed() { return this.dungeon.maxed(); }

	/**
	 * @property {number} length - length of dungeon in progress.
	 */
	get length() { return this.dungeon.length; }

	/**
	 * @property {Npc[]} enemies - enemies currently being encountered (in combat)
	 */
	get enemies() { return this._enemies; }
	set enemies(v) {

		for( let i = v.length-1; i>= 0; i--) v[i] = new Npc(v);
		this._enemies = v;
	}

	/**
	 * @property {Npc[]} allies - creatures fighting for player.
	 */
	get allies() { return this._allies; }
	set allies(v) { this._allies=v; }

	/**
	 * @property {Inventory} drops - items dropped in current dungeon.
	 * can be taken by player.
	 */
	get drops() { return this._drops; }
	set drops(v) {
		this._drops = (v instanceof Inventory ) ? v : new Inventory(v);
	}

	toJSON() {

		return {
			dungeon:this.dungeon ? this.dungeon.id : undefined,
			enemies:this._enemies,
			allies:this.allies,
			drops:this.drops
		}

	}

	/**
	 *
	 * @param {?Object} [vars=null]
	 */
	constructor( vars=null ) {

		if ( vars ) Object.assign( this, vars);

		this.drops = this.drops || new Inventory();

		/**
		 * @property {Dungeon} dungeon - current dungeon.
		 */
		this.dungeon = this.dungeon || null;

		this._enemies = this._enemies || [];

	}

	revive( gameState ) {

		this.state = gameState;
		this.player = gameState.player;

		this.drops.revive(gameState);

		for( let i = this._enemies.length-1; i>=0; i-- ) this._enemies[i].revive(gameState);

		if ( typeof this.dungeon === 'string') this.dungeon = gameState.getData(this.dungeon);

	}

	update(dt) {

		if ( this.dungeon == null ) return;

		if ( this._enemies.length === 0 ) {

			this.nextEnemy();
			this.player.timer = this.player.delay;

		} else {

			this.player.timer -= dt;
			if ( this.player.alive === false ) {
				this.playerDied();
				return;
			}
			if ( this.player.timer <= 0 ) {

				this.player.timer += this.player.delay;

				// attempt to use primary item attack first.
				if ( !this.player.primary || !Game.tryItem( this.player.primary )) {

					if ( this.player.weapon ) this.playerAttack( this.player.weapon );
					else this.baseAttack( this.player );

				}

			}

			for( let i = this._enemies.length-1; i >= 0; i-- ) {

				var e = this._enemies[i];
				if ( e.alive === false ) { this._enemies.splice(i,1); continue;}
				var action = e.update(dt);
				if ( action ) this.enemyAttack( e, action, this.player );

			}

		}

	}

	/**
	 * Player-casted spell or action attack.
	 * @param {Item} it
	 */
	spellAttack( it ) {

		//console.log('spell attack');
		if ( this.dungeon == null || !this._enemies.length===0 ) {

			Events.dispatch(EVT_COMBAT, null, this.player.name + ' casts ' + it.name + ' at the darkness.' );

		} else this.playerAttack( it );

	}

	/**
	 * Attack without weapon.
	 * @todo replace with something more logical.
	 * @param {Player} player
	 */
	baseAttack( player ) {

		let e = this.enemies[0];

		if ( this.tryHit( player, e ) ) {

			if ( tryDamage( e, player ) ) if ( e.hp <= 0 ) this.enemyDied(e, player);

		} else {

			Events.dispatch( DAMAGE_MISS, player.name + ' misses', 'combat' );

		}

	}

	/**
	 *
	 * @param {Item} src - attack source. (spell,weapon,etc.)
	 */
	playerAttack( src ) {

		let atk = src.attack;

		let e = this.enemies[0];

		if ( this.tryHit( this.player, e, atk ) ) {

			if ( tryDamage( e, atk, this.player ) ) if ( e.hp <= 0 ) this.enemyDied( e );

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

	dodgeRoll( dodge, tohit ) {

		let x = ( tohit > dodge ? 1 : dodge - tohit )/10;
		return ( Math.exp( -x*x ) );

	}

	charDied( char, attacker ) {

		if ( char === this.player ) this.playerDied();
		else this.enemyDied( char, attacker );

	}

	playerDied() {
		Events.dispatch( PLAYER_SLAIN, null );
		Game.setAction( this.state.restAction );
	}

	/**
	 * Get next dungeon enemy.
	 */
	nextEnemy() {

		var enemy = this.dungeon.getEnemy();
		if (  Array.isArray(enemy)){

			let enemyList = [];

			for( let i = enemy.length-1; i >=0; i-- ) {
				var e = enemy[i];
				if ( typeof e === 'string' ) e = Game.getData(e);
				this._enemies.push( new Npc( e ) );

				enemyList.push( e.name);
			}

			Events.dispatch( EVT_COMBAT, enemyList.join(',') + ' Encountered' );

		} else {

			if ( typeof enemy === 'string' ) enemy = Game.getData( enemy );
			if ( !enemy) {console.warn( 'Missing Enemy'); return }
			this._enemies.push( new Npc(enemy ) );

			Events.dispatch( EVT_COMBAT, enemy.name + ' Encountered' );
		}

	}

	enemyDied( enemy, attacker ) {

		this.player.exp += 1 + Math.max( enemy.level - this.player.level, 0 );
		this.player.timer = this.player.delay;

		if ( enemy.id ) {
			let tmp = this.state.getData(enemy.id);
			if ( tmp ) {
				tmp.value++;
			}
		}

		Events.dispatch( ENEMY_SLAIN, enemy, attacker );

		if ( enemy.result ) Game.applyEffect( enemy.result );
		if ( enemy.loot ) Game.getLoot( enemy.loot, this.drops );

		this.progress += 1;

	}

	raidDone() {

		this.dungeon.progress = this.dungeon.length;
		this.dungeon.dirty = true;

		if ( this.dungeon.loot ) Game.getLoot( this.dungeon.loot, this.drops );

		if ( this.dungeon.result ) Game.applyEffect( this.dungeon.result );

		this.player.exp += (this.dungeon.level)*( 15 + this.dungeon.length );
		this.dungeon = null;

		Game.doRest();

	}

	setDungeon( d ) {

		this.player.timer = this.player.delay;

		if ( d != null ) {

			if ( d != this.dungeon ) {
				this._enemies = [];
				this.drops.clear();
			}

			if ( d.progress >= d.length ) d.progress = 0;
		}

		this.dungeon = d;

	}

}