import Item from './item';

/**
 * @type {Object} Enemy
 * @property {number} weight - weighted chance of attack occuring
 * @property {number} min - min damage
 * @property {number} max - max damage
 * @property {string} type - attack type
 * @property {number} defense
 * @property {number} attack
 * @property {number} hp
 */

export default class Dungeon extends Item {

	/**
	 * @property {number} length - length of dungeon to completion.
	 */
	get length() { return this._length; }
	set length(v) { this._length = v; }

	get level() {return this._level;}
	set level(v) { this._level =v;}

	get enemies() { return this._enemies; }
	set enemies(v) {
		this._enemies = v;
		this.initEnemies(v);
	}

	get progress() { return this._progress; }
	set progress(v) { this._progress = v;}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		super(vars);

		this._level = this._level !== undefined ? this._level : 1;
		this._progress = this._progress || 0;
		this._length = this._length || 100;

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

		for( let e of enemies ) {

			if ( !e.speed) e.speed = 1;
			e.delay = 1/e.speed;

			if ( !e.level ) e.level = 1;
			if ( !e.hp ) e.hp = 1;
			if ( e.attack === undefined ) e.attack = 1;
			if ( e.defense === undefined ) e.defense = 1;

		}

	}

	/**
	 * Get next enemy.
	 */
	getEnemy() {

		return this._enemies[ Math.floor( Math.random()*this._enemies.length ) ];
	}

	levelTest(state, self) {
		return state.player.level >= self.level;
	}

	/**
	 * 
	 */
	totalWeights() {

		let tot = 0;
		for( let a of this._enemies ) tot += a.weight || 1;
		return tot;

	}

}