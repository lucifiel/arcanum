import Game from '../game';
import Dot from './dot';

/**
 * Represents the current enemy being fought.
 */
export default class Enemy {

	constructor( vars=null, raid ){

		if ( vars ) Object.assign(this.vars);

		this.dots = this.dots || [];

		this.raid = raid;
		this.log = Game.log;
		console.log('thislog: ' + this.log );

		this.alive = this.alive || false;

	}

	setEnemy( item ) {

		if ( typeof item === 'string' ) item = Game.getItem(item);

		/**
		 * Note: id and name are properties of Item, not item insance,
		 * so are not assigned by default.
		 */
		this.id = item.id;
		this.name = item.name;
		Object.assign( this, item );

		/// timer to next attack.
		this.timer = item.delay;

		this.alive = true;


	}

	/**
	 * Base item of dot.
	 * @param {Object} item 
	 */
	addDot( item ) {

		this.dots.push( new Dot(item) );
	}

	update(dt) {

		if ( this.alive===false) return;

		this.timer -= dt;
		if ( this.timer <= 0 ) {

			this.timer += this.delay;
			this.raid.enemyAttack(this);

		}

		for( let i = this.dots.length-1; i >= 0; i-- ) {

			var dot = this.dots[i];
			let dotTime = dot.tick(dt);

			if ( dotTime ) {

				if ( dot.damage ) {
					this.doDamage( this.raid.getDamage( dot.damage ) );
				}
				if ( dot.duration <= 0 ) {
					this.dots.splice( i, 1);
				}
	
			}

		}

	}

	doDamage( dmg ) {

		this.hp -= dmg;

		this.log.log( '',
			this.name + ' hit by ' + this.name + ': ' + dmg.toFixed(1),
			'combat' );

		if ( this.hp <= 0 ) this.clear();

	}

	/**
	 * Clear the current enemy.
	 */
	clear() {
		this.alive = false;
		this.dots = [];
	}

}