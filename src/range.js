export const RangeTest = /^\d+\.?\d*\~\d+\.?\d*$/i;

const SPLIT_CHAR = '~';

export default class Range {

	toJSON() { return this.min + SPLIT_CHAR + this.max; }

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
	constructor(min=0, max=undefined) {

		let type = typeof min;
		if ( type === 'object' ) Object.assign( this, min );
		else if ( type === 'string') {

			let parts = min.split( SPLIT_CHAR );
			this.min = Number( parts[0] );
			this.max = Number( parts[1] );

		} else {

			this.min = Number( min );
			this.max = Number( max === undefined ? min : max );

		}

		//console.log('min: ' + this.min + ' -> ' + this.max );


	}

}