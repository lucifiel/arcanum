import Game from '../game';
import Dot from './dot';
import { getDelay } from './player';
import Range from '../range';
/**
 * Represents the current enemy being fought.
 */
export default class Enemy {

	toJSON(){

		let data = {
		}

		for( let k in this ) {

			if ( k[0] === '_' || k === 'raid' || k === 'log') continue;
			data[k] = ( this[k] );

		}

		return data;

	}

	constructor( vars=null, raid=null ){

		if ( vars ) Object.assign( this, vars );

		if ( this.hp instanceof Range ) this.hp = this.hp.value;

		this.dots = this.dots || [];

		this.raid = raid;
		this.log = Game.log;
		this.delay = getDelay( this.speed );

		this.alive = this.alive || false;

	}

	setEnemy( item ) {

		if ( typeof item === 'string' ) item = Game.getItem(item);
		if ( !item ) {
			console.warn( 'item not found: ' + item );
		}

		this.loot = null;
		this.attack = null;

		/**
		 * Note: id and name are properties of Item, not item insance,
		 * so are not assigned by default.
		 */
		this.id = item.id;
		this.name = item.name;
		Object.assign( this, item );

		if ( this.hp instanceof Range ) this.hp = this.hp.value;

		this.delay = item.delay;
		this.speed = item.speed;

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
			if ( this.damage || this.attack ) this.raid.enemyAttack(this);

		}

		for( let i = this.dots.length-1; i >= 0; i-- ) {

			var dot = this.dots[i];
			let dotTime = dot.tick(dt);

			if ( dotTime ) {

				if ( dot.duration <= 0 ) {
					this.dots.splice( i, 1);
				}
				if ( dot.damage ) {
					this.doDamage( this.raid.getDamage( dot.damage ), dot );
					if ( !this.alive ) break;
				}
	
			}

		}

	}

	doDamage( dmg, src ) {

		this.hp -= dmg;

		this.log.log( '',
			this.name + ' hit by '
				+ src.name
				+ ': ' + dmg.toFixed(1),
			'combat' );

		if ( this.hp <= 0 ) this.alive=false;

	}

	/**
	 * Clear the current enemy.
	 */
	clear() {
		this.id = this.name = '';
		this.dots = [];
	}

}