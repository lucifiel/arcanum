import Item from './item';
import Monster from './monster';

/**
 * @type {Object} Enemy
 * @property {number} weight - weighted chance of attack occuring. Not Implemented.
 * @property {number} min - min damage
 * @property {number} max - max damage
 * @property {string} type - attack type
 * @property {number} defense
 * @property {number} attack
 * @property {number} hp
 */

export default class Dungeon extends Item {

	get level() {return this._level;}
	set level(v) { this._level =v;}

	get enemies() { return this._enemies; }
	set enemies(v) {
		this._enemies = v;
		this.initEnemies(v);
	}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		super(vars);

		this.level = this._level !== undefined && this._level !== null ? this._level : 1;

		/**
		 * @property {number} progress
		 */
		this.progress = this.progress || 0;
		this._length = this._length || 100;

		this.repeat = ( this.repeat === undefined||this.repeat===null ) ? true : this.repeat;

		// default require for dungeon is player-level.
		this.require = this.require || this.levelTest;

		this._type = this._type || 'dungeon';

		/**
		 * Total of all enemy weights, used to roll which
		 * enemy is used.
		 * @property {number} attackTot
		 */
		//this.attackTot = this.totalWeights();

	}

	initEnemies( enemies ) {

		for( let i = enemies.length-1; i>= 0; i-- ) {

			var e = enemies[i];
			if ( e instanceof Object ) enemies[i] = new Monster(e);

		}

	}

	/**
	 * Get next enemy.
	 * @returns {string|Monster|Object}
	 */
	getEnemy() {

		if ( this.boss ) {

			if ( this.progress === this.length-1 && typeof this.boss === 'string' ) {
				return this.boss;
			} else {

				if ( this.boss[this.progress+1]) return this.boss[this.progress+1];
			}

		}

		return this._enemies[ Math.floor( Math.random()*this._enemies.length ) ];

	}

	levelTest(state, self) {
		return state.player.level >= self.level-1;
	}

	/**
	 * 
	 */
	/*totalWeights() {

		let tot = 0;
		for( let a of this._enemies ) tot += a.weight || 1;
		return tot;

	}*/

}