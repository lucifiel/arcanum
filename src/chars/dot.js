export default class Dot {

	constructor( vars ){

		Object.assign( this, vars );

		this.acc = 0;

	}

	/**
	 * Ticks dt and returns the amount the dot has actually ticked,
	 * (allowing for seconds-only updates.)
	 * @param {number} dt 
	 */
	tick(dt) {

		this.acc += dt;
		if ( this.acc >= 1 ) {

			this.acc--;
			this.duration--;
			return 1;

		}

		return 0;

	}

}