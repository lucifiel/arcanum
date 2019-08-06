import Game from '../game';
import Enemy from './enemy';
import Range from '../range';

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
	 * @property {Enemy} enemy - current enemy.
	 */
	get enemy() { return this._enemy;}
	set enemy(v) {

		if (typeof v === 'string') v = Game.getItem(v);
		if (!this._enemy ) this._enemy = new Enemy(v, this, Game.log );
		else this._enemy.setEnemy(v);

	}

	toJSON() {

		return {
			dungeon:this.dungeon ? this.dungeon.id : undefined,
			enemy:this.enemy,
			playerAct:this.playerAct,
			enemyAct:this.enemyAct
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

		if ( !this.enemy ) this.enemy = null;

		this.playerAct = '';
		this.enemyAct = '';

	}

	initState( gameState ) {

		this.state = gameState;
		this.player = gameState.player;
		//this.dungeon = gameState.dungeon;

		if ( typeof this.dungeon === 'string') this.dungeon = gameState.getItem(this.dungeon);

	}

	update(dt) {

		if ( this.dungeon == null ) return;

		if ( this.enemy.alive===false ) {

			this.enemy = this.dungeon.getEnemy();
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

			this.enemy.update(dt);
			if ( this.enemy.alive === false ) this.enemyDied();

		}

	}

	/**
	 * Player-casted spell or action attack.
	 * @param {*} it 
	 */
	spellAttack( it ) {

		console.log('spell attack');
		if ( this.dungeon == null || !this.enemy.alive ) {

			this.playerAct = this.player.name + ' casts ' + it.name + ' at the darkness.';
			Game.log.log( '', this.playerAct, 'combat');

		} else this.playerAttack( it );

	}

	/**
	 * Attack without weapon.
	 * @todo replace with something more logical.
	 * @param {Player} player 
	 */
	baseAttack( player ) {

		if ( this.tryHit( player, this.enemy ) ) {

			if ( player.damage != null ) {

				let dmg = this.getDamage( player.damage );

				this.enemy.doDamage( dmg, player );

			}

		} else {

			this.playerAct = player.name + ' misses';
			Game.log.log( '', this.playerAct, 'combat');

		}

	}

	/**
	 * 
	 * @param {Object} src - attack source. (spell,weapon,etc.)
	 */
	playerAttack( src ) {

		let atk = src.attack;

		if ( this.rollHit( this.player, atk, this.enemy ) ) {

			if ( atk.damage != null ) {

				let dmg = this.getDamage( atk.damage ) + this.player.damage;

			//this.playerAct = this.enemy.name + ' hit: ' + dmg.toFixed(1);
			//Game.log.log( '', this.playerAct, 'combat');

				this.enemy.doDamage( dmg, src );

			}
			if ( atk.dot ) this.enemy.addDot( atk.dot, src.name );

		} else {

			this.playerAct = this.player.name + ' misses';
			Game.log.log( '', this.playerAct, COMBAT_LOG );

		}

	}

	enemyAttack( enemy ) {

		//console.log('monster attack: ' + atk);

		if ( this.tryHit( enemy, this.player ) ) {

			if ( enemy.damage ) {
				let dmg = this.getDamage( enemy.damage );
				this.enemyAct = this.player.name + ' hit: ' + dmg.toFixed(1);
				this.player.hp -= dmg;
			}

			if ( this.player.hp <= 0 ) this.playerDied();

		} else {
			this.enemyAct = enemy.name + ' misses';
		}
		Game.log.log( '', this.enemyAct, COMBAT_LOG );

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
		else return dmg( this.state, this.player, this.enemy );

	}

	playerDied() {
		Game.setAction( this.state.restAction );
	}

	enemyDied() {

		this.player.exp += 1 + this.enemy.level;
		this.player.timer = this.player.delay;
		
		this.enemyAct = this.enemy.name + ' slain';
		Game.log.log( '', this.enemyAct, COMBAT_LOG );

		if ( this.enemy.result ) Game.applyEffect( this.enemy.result );
		if ( this.enemy.loot ) Game.getLoot( this.enemy.loot );

		this.enemy.clear();

		this.progress += 1;

	}

	raidDone() {

		// can go over by cheat codes, or possibly unknown future skip-buffs.
		this.dungeon.progress = this.dungeon.length;

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
			this.enemy.alive = false;
			if ( d.progress >= d.length ) d.progress = 0;
		}

	}

}