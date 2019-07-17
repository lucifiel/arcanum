import Game from '../game';
import Enemy from './enemy';
import Range from '../range';

/**
 * Represents an active dungeon raid.
 */
export default class Raid {

	toJSON() {

		return {
			dungeon:this.dungeon.id,
			enemy:JSON.stringify( this.enemy ),
			playerAct,
			enemyAct
		}

	}

	get id() { return this.dungeon.id;}
	get name() { return this.dungeon.name; }

	get cost() { return this.dungeon ? this.dungeon.cost : null; }

	get progress(){ return this.dungeon.progress; }
	/**
	 * For cheating only.
	 */
	set progress(v){
		this.dungeon.progress=v;
	}
	get length() { return this.dungeon.length; }

	get enemy() { return this._enemy;}
	set enemy(v) {

		if (!this.enemy ) this._enemy = new Enemy(v, this);
		else this._enemy.setEnemy(v);

	}

	constructor( vars=null ) {

		if ( vars ) Object.assign(vars, this);

		/**
		 * @property {Dungeon} dungeon - current dungeon.
		 */
		this.dungeon = this.dungeon || null;

		this.enemy = this._enemy || null;

		this.playerAct = '';
		this.enemyAct = '';

	}

	maxed() { return false; }

	initState( gameState ) {

		this.state = gameState;
		this.player = gameState.player;
		this.dungeon = gameState.dungeon;

	}

	update(dt) {

		if ( this.dungeon == null ) return;

		if ( this.enemy.alive===false ) {

			this.enemy.setEnemy( this.dungeon.getEnemy() );
			this.player.timer = this.player.delay;

		} else {

			this.player.timer -= dt;
			if ( this.player.timer <= 0 ) {

				this.player.timer += this.player.delay;

				// attempt to use primary item attack first.
				if ( !this.player.primary || !Game.tryItem( this.player.primary )) {
					this.playerAttack( this.player, this.player );
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

		} else this.playerAttack( it.attack, it );

	}

	/**
	 * 
	 * @param {Object} it - attack object. 
	 */
	playerAttack( it, src ) {

		if ( this.tryHit(this.player, this.enemy ) ) {

			if ( it.damage != null ) {

				let dmg = this.getDamage( it.damage );

			//this.playerAct = this.enemy.name + ' hit: ' + dmg.toFixed(1);
			//Game.log.log( '', this.playerAct, 'combat');

				this.enemy.doDamage( dmg, src );

			}
			if ( it.dot ) this.enemy.addDot( it.dot, src.name );

		} else {

			this.playerAct = this.player.name + ' misses';
			Game.log.log( '', this.playerAct, 'combat');

		}

	}

	enemyAttack( enemy ) {

		//console.log('monster attack: ' + atk);

		if ( this.tryHit( enemy, this.player ) ) {

			let dmg = this.getDamage( enemy.damage );

			this.enemyAct = this.player.name + ' hit: ' + dmg.toFixed(1);

			this.player.hp -= dmg;
			if ( this.player.hp <= 0 ) this.playerDied();

		} else {
			this.enemyAct = enemy.name + ' misses';
		}

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
	 * @param {number|function|Range} dmg 
	 */
	getDamage(dmg) {

		if ( dmg instanceof Range) return dmg.value;
		else if ( !isNaN(dmg) ) return dmg;
		else return dmg( this.state, this.player, this.enemy );

	}

	playerDied() {
		Game.setAction( this.state.restAction );

	}

	enemyDied() {

		this.player.exp += this.enemy.level;
		this.dungeon.progress++;

		this.enemyAct = this.enemy.name + ' slain';
		Game.log.log( '', this.enemyAct, 'combat');

		this.enemy.clear();

		if ( this.dungeon.progress >= this.dungeon.length ) {
			this.raidDone( this.dungeon );
		}

	}

	raidDone() {

		// can go over by cheat codes, or possibly unknown future skip-buffs.
		this.dungeon.progress = this.dungeon.length;

		this.player.exp +=  (this.dungeon.level)*( 10 + this.dungeon.length );
		this.dungeon = null;
		Game.doRest();

	}

	setDungeon( d ) {
		this.dungeon = d;
		this.player.timer = 0;
		if ( d.progress >= d.length ) d.progress = 0;
	}

}