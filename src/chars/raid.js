import Game from '../game';
import Char from './char';
import Range from '../range';
import Dot from './dot';
import Npc from './npc';

const COMBAT_LOG = 'combat';

/**
* Attempt to damage a target. Made external for use by dots, other code.
* @param {Char} target 
* @param {Object} attack 
*/
export function tryDamage( target, attack, attacker ) {

	if ( attack.kind ) {

		if ( target.isImmune(attack.kind) ) {
			Game.log.log( '', target.name + ' is immune to ' + attack.kind );
			return false;
		}
		if ( target.tryResist(attack.kind) ) {
			Game.log.log( '', target.name + ' resists ' + attack.kind );
			return false;
		}

	}
	if ( attack.damage ) {

		// add optional base damage from attacker.
		let dmg = getDamage( attack.damage )
			+ ( (attacker && attacker!==attack) ? (attacker.damage || 0) : 0);

		target.hp -= dmg;

		var attackName = attack.name || ( attacker ? attacker.name : '' );
		Game.log.log( '', target.name + ' hit' +
			( attackName ? ' by ' + attackName : '' ) +
			': ' + dmg.toFixed(1),
			COMBAT_LOG );

		if ( attack.leech && attacker ) {
			let amt = Math.floor( 100*attack.leech*dmg )/100;
			attacker.hp += amt;
			Game.log.log( '', attacker.name + ' steals ' + amt + ' life.' );
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

	get progress(){ return this.dungeon.progress; }
	set progress(v){

		this.dungeon.progress=v;
		
		if ( this.dungeon.progress >= this.dungeon.length ) {
			console.log('RAID DONE');
			this.raidDone( this.dungeon );
		}

	}

	percent() { return this.dungeon.percent(); }
	maxed() { return this.dungeon.maxed(); }

	/**
	 * @property {number} length - length of dungeon in progress.
	 */
	get length() { return this.dungeon.length; }

	/**
	 * @property {Char} enemy - backward save compatibility.
	 */
	set enemy(v) {

		if ( !this._enemies ) this._enemies = [];
		if (typeof v === 'string') v = Game.getItem(v);
		this._enemies.push( new Char(v) );

	}

	get enemies() { return this._enemies; }
	set enemies(v) {

		for( let i = v.length-1; i>= 0; i--) v[i] = new Char(v);
		this._enemies = v;
	}

	toJSON() {

		return {
			dungeon:this.dungeon ? this.dungeon.id : undefined,
			enemies:this._enemies
		}

	}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ) {

		if ( vars ) Object.assign( this, vars);

		/**
		 * @property {Dungeon} dungeon - current dungeon.
		 */
		this.dungeon = this.dungeon || null;

		this._enemies = this._enemies || [];

	}

	revive( gameState ) {

		this.state = gameState;
		this.player = gameState.player;

		for( let i = this._enemies.length-1; i>=0; i-- ) this._enemies[i].revive(gameState);

		if ( typeof this.dungeon === 'string') this.dungeon = gameState.getItem(this.dungeon);

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
				var action = e.update(dt);
				if ( e.alive === false ) {
					this._enemies.splice(i,1);
				}
				else if ( action ) this.enemyAttack( e, action, this.player );

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

			Game.log.log( '', this.player.name + ' casts ' + it.name + ' at the darkness.', 'combat');

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

			Game.log.log( '', player.name + ' misses', 'combat');

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

		} else {

			Game.log.log( '', this.player.name + ' misses', COMBAT_LOG );

		}

	}

	/**
	 * 
	 * @param {Char} enemy - enemy attacking. 
	 * @param {Object|Char} attack - attack object. 
	 * @param {Char} target - target of attack. ( currently player ).
	 */
	enemyAttack( enemy, attack, target ) {

		if ( this.tryHit( enemy, target, (attack!=enemy)?attack:null ) ) {

			if ( tryDamage( target, attack, enemy ) ) if ( target.hp <= 0 ) this.charDied( target );

		} else Game.log.log( '', enemy.name + ' misses', COMBAT_LOG );

	}

	/**
	 * Rolls an attack roll against a defender.
	 * @param {Char} attacker - attack object
	 * @param {Char} defender - defending char.
	 * @param {Object} attack - attack or weapon used to hit.
	 * @returns {boolean} true if char hit.
	 */
	tryHit( attacker, defender, attack ){

		return Math.random()*( 10 + attacker.tohit + (attack ? attack.tohit || 0 : 0) )
			>= Math.random()*(10 + defender.defense );
	}

	charDied( char, attacker ) {

		if ( char === this.player ) this.playerDied();
		else this.enemyDied( char, attacker );

	}

	playerDied() {
		Game.setAction( this.state.restAction );
	}

	/**
	 * Get next dungeon enemy.
	 */
	nextEnemy() {
		
		var enemy = this.dungeon.getEnemy();
		if (  Array.isArray(enemy)){

			for( let i = enemy.length-1; i >=0; i-- ) {
				var e = enemy[i];
				if ( typeof e === 'string' ) e = Game.getItem(e);
				this._enemies.push( new Npc( e ) );
			}

		} else {

			if ( typeof enemy === 'string' ) enemy = Game.getItem( enemy );
			if ( !enemy) {console.warn( 'Missing Enemy'); return }
			this._enemies.push( new Npc(enemy ) );

		}

	}

	enemyDied( enemy, attacker ) {

		this.player.exp += 1 + enemy.level;
		this.player.timer = this.player.delay;

		if ( enemy.id ) {
			let tmp = this.state.getItem(enemy.id);
			if ( tmp ) {
				tmp.value++;
				console.log('ENEMY INC: ' + tmp.value );
			}
		}

		Game.log.log( '', enemy.name + ' slain' + ( attacker ? ' by ' + attacker.name : ''), COMBAT_LOG );

		if ( enemy.result ) Game.applyEffect( enemy.result );
		if ( enemy.loot ) Game.getLoot( enemy.loot );

		this.progress += 1;

	}

	raidDone() {

		// can go over by cheat codes, or possibly unknown future skip-buffs.
		this.dungeon.progress = this.dungeon.length;
		this.dungeon.dirty = true;

		if ( this.dungeon.loot ) Game.getLoot( this.dungeon.loot );
		if ( this.dungeon.result ) Game.applyEffect( this.dungeon.result );

		this.player.exp += (this.dungeon.level)*( 15 + this.dungeon.length );
		this.dungeon = null;

		Game.doRest();

	}

	setDungeon( d ) {

		this.dungeon = d;
		this.player.timer = this.player.delay;

		if ( d != null ) {
			this._enemies = [];
			if ( d.progress >= d.length ) d.progress = 0;
		}

	}

}