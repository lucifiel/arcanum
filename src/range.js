export default class Range {

	/**
	 * @property {number} value - getting a range value
	 * returns a random number in the range, inclusive.
	 */
	get value() {
		return this.min + Math.random()*( this.max - this.min );
	}

	/**
	 * 
	 * @param {Object|number|string} min 
	 * @param {?number} max 
	 */
	constructor(min=0, max=null) {

		if ( min instanceof Object ) Object.assign( this, min );
		else if ( !isNaN(min)) {

			this.min = min;
			this.max = max || 0;

		} else if ( typeof min === 'string') {

		}


	}

}