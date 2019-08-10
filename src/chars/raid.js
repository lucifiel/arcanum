import Game from '../game';
import Char from './char';
import Range from '../range';
import { clone, randElm  } from 'objecty'

const COMBAT_LOG = 'combat';

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

	initState( gameState ) {

		this.state = gameState;
		this.player = gameState.player;
		//this.dungeon = gameState.dungeon;

		if ( typeof this.dungeon === 'string') this.dungeon = gameState.getItem(this.dungeon);

	}

	update(dt) {

		if ( this.dungeon == null ) return;

		if ( this._enemies.length === 0 ) {

			this.nextEnemy();
			this.player.timer = this.player.delay;

		} else {

			this.player.timer -= dt;
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

		console.log('spell attack');
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

		let e = randElm( this.enemies );
		if ( e === undefined ) return;

		if ( this.tryHit( player, e ) ) {

			if ( player.damage != null ) {

				let dmg = this.getDamage( player.damage );

				e.doDamage( dmg, player );

			}

		} else {

			Game.log.log( '', player.name + ' misses', 'combat');

		}

	}

	/**
	 * 
	 * @param {Object} src - attack source. (spell,weapon,etc.)
	 */
	playerAttack( src ) {

		let atk = src.attack;

		let e = randElm( this.enemies );
		if ( e === undefined ) return;

		if ( this.rollHit( this.player, atk, e ) ) {

			if ( atk.damage != null ) {

				let dmg = this.getDamage( atk.damage ) + this.player.damage;

				e.doDamage( dmg, src );

			}
			if ( atk.dot ) e.addDot( atk.dot, src.name );

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

		//console.log('monster attack: ' + atk);

		var actStr;

		if ( this.tryHit( enemy, target ) ) {

			if ( attack.damage ) {
				let dmg = this.getDamage( attack.damage );
				actStr = target.name + ' hit: ' + dmg.toFixed(1);
				target.hp -= dmg;
			}

			if ( target.hp <= 0 ) this.charDied( target, enemy );

		} else actStr = enemy.name + ' misses';

		Game.log.log( '', actStr, COMBAT_LOG );

	}

	/**
	 * 
	 * @param {Char} target 
	 * @param {Object} attack 
	 */
	tryDamage( target, attack ) {

		if ( attack.kind ) {

			if ( target.isImmune(attack.kind) ) {
				Game.log.log( '', target.name + ' is immune to ' + attack.kind );
				return false;
			}
			if ( target.resists(attack.kind) ) {
				Game.log.log( '', target.name + ' resists ' + attack.kind );
				return false;
			}

		}
		let dmg = this.getDamage( attack.damage );
		target.hp -= dmg;
		if ( target.hp <= 0 ) this.charDied( target );

		return true;

	}

	rollHit( attacker, weapon, defender ) {
		return Math.random()*( attacker.tohit + weapon.tohit ) >= Math.random()*defender.defense;
	}

	/**
	 * Rolls a player attack roll against the current enemy.
	 * @param {Object} attacker - attack object
	 * @returns {boolean} true if enemy hit.
	 */
	tryHit( attacker, defender ){
		return Math.random()*attacker.tohit >= Math.random()*defender.defense;
	}

	/**
	 * Convert damage object to raw damage value.
	 * @param {number|function|Range} dmg /
	 */
	getDamage( dmg ) {

		if ( dmg instanceof Range) return dmg.value;
		else if ( !isNaN(dmg) ) return dmg;

		// TODO: invalid
		//else return dmg( this.state, this.player, this.enemy );

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
		if ( enemy instanceof Array ){

			for( let i = enemy.length-1; i >=0; i-- ) {
				var e = enemy[i];
				if ( typeof e === 'string' ) e = Game.getItem(e);
				this._enemies.push( new Char( clone(e) ) );
			}

		} else {
			if ( typeof enemy === 'string' ) enemy = Game.getItem( enemy );
			this._enemies.push( new Char( clone(enemy )) );
		}

	}

	enemyDied( enemy, attacker ) {

		this.player.exp += 1 + enemy.level;
		this.player.timer = this.player.delay;
		
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