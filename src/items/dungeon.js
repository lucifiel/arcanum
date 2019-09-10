import Monster from './monster';
import Action from './action';

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

export default class Dungeon extends Action {

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

		this.level = this.level !== undefined ? this.level : 1;

		this.type = 'dungeon';

		/**
		 * @property {number} progress
		 */
		this._exp = this._exp || 0;
		this._length = this._length || 100;

		// default require for dungeon is player-level.
		this.require = this.require || this.levelTest;

		this.dist = ( this.dist === undefined || this.dist === null ) ? 5*Math.floor( Math.exp(this.level/2) ) : this.dist;
		//this.addRequire( 'dist', this.dist );

		if ( this.need == null ) this.need = this.distTest;

		/**
		 * Total of all enemy weights, used to roll which
		 * enemy is used.
		 * @property {number} attackTot
		 */
		//this.attackTot = this.totalWeights();

	}

	/**
	 * Don't reset progress, to show dungeon has been completed.
	 */
	complete() {}

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

			if ( typeof this.boss === 'string') {

				if ( this.exp === this.length-1) return this.boss;

			} else {

				if ( this.boss.hasOwnProperty( (this.exp+1) ) ) return this.boss[this.exp+1];
			}

		}

		return this._enemies[ Math.floor( Math.random()*this._enemies.length ) ];

	}

	distTest( g, self) {
		return g.dist >= self.dist;
	}

	levelTest(g, self) {
		return g.player.level >= (self.level-1);
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