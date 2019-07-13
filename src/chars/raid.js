import Game from '../game';
import Enemy from './enemy';
import Range from '../range';

/**
 * Represents an active dungeon raid.
 */
export default class Raid {

	get id() { return this.dungeon.id;}
	get name() { return this.dungeon.name; }

	get cost() { return this.dungeon ? this.dungeon.cost : null; }

	get progress(){ return this.dungeon.progress; }
	get length() { return this.dungeon.length; }

	get enemy() { return this._enemy;}
	set enemy(v) {

		if (!this.enemy ) this._enemy = new Enemy(v, this);
		else this._enemy.setEnemy(v);

	}

	constructor( vars=null ) {

		if ( vars ) Object.assign(vars, this);

		this.active = this.active || false;
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

		if ( this.active === false ) return;
		if ( this.dungeon == null ) {
			this.active = false;
			return;
		}

		if ( this.enemy.alive===false ) {

			this.enemy.setEnemy( this.dungeon.getEnemy() );
			this.player.timer = this.player.delay;

		} else {

			this.player.timer -= dt;
			if ( this.player.timer <= 0 ) {

				this.player.timer += this.player.delay;

				// attempt to use primary item attack first.
				if ( !this.player.primary || !Game.tryItem( this.player.primary )) {
					this.playerAttack( this.player );
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

		if ( this.dungeon == null || this.enemy === null ) {

			this.playerAct = this.player.name + ' casts ' + it.name + ' at the darkness.';
			Game.log.log( '', this.playerAct, 'combat');

		} else this.playerAttack(it);

	}

	/**
	 * 
	 * @param {Object} it - attack object. 
	 */
	playerAttack( it ) {

		if ( this.tryHit(it) ) {

			if ( it.damage != null ) {

				let dmg = this.getDamage( it.damage );

			//this.playerAct = this.enemy.name + ' hit: ' + dmg.toFixed(1);
			//Game.log.log( '', this.playerAct, 'combat');

				this.enemy.doDamage( dmg );

			}
			if ( it.dot ) this.enemy.addDot( it.dot );

		} else {

			this.playerAct = this.player.name + ' misses';
			Game.log.log( '', this.playerAct, 'combat');

		}

	}

	/**
	 * Rolls a player attack roll against the current enemy.
	 * @param {Object} it - attack object
	 * @returns {boolean} true if enemy hit.
	 */
	tryHit( it ){
		return Math.random()*it.tohit >= Math.random()*this.enemy.defense;
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

	enemyAttack( enemy ) {

		//console.log('monster attack: ' + atk);

		if (  Math.random()*enemy.tohit >= Math.random()*this.player.defense ) {

			let dmg = enemy.min +
				Math.round( Math.random()*( enemy.max-enemy.min) );

			this.enemyAct = this.player.name + ' hit: ' + dmg.toFixed(1);

			this.player.hp -= dmg;
			if ( this.player.hp <= 0 ) this.playerDied();

		} else {
			this.enemyAct = enemy.name + ' misses';
		}

	}

	playerDied() {
		Game.setAction( this.state.restAction );

	}

	enemyDied() {

		console.log('enemey died');
		this.player.exp += this.enemy.level;
		this.dungeon.progress++;

		this.enemyAct = this.enemy.name + ' slain';
		Game.log.log( '', this.enemyAct, 'combat');

		if ( this.dungeon.progress >= this.dungeon.length ) {
			this.raidDone( this.dungeon );
		}

	}

	raidDone() {

		this.player.exp += 5*this.dungeon.length;
		this.dungeon = null;
		Game.setAction( this.state.restAction );

	}

	setDungeon( d ) {
		this.dungeon = d;
		this.player.timer = 0;
		if ( d.progress >= d.length ) d.progress = 0;
		this.active = true;
	}

}