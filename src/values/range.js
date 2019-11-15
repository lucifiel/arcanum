import { TYP_RANGE } from "./consts";
import { precise } from "../util/format";

export const RangeTest = /^\-?\d+\.?\d*\~\-?\d+\.?\d*$/i;

const SPLIT_CHAR = '~';

export default class Range {

	toJSON() { return this.min + SPLIT_CHAR + this.max; }

	toString() { return precise( this.min ) + ' ' + SPLIT_CHAR + ' ' + precise(this.max ); }

	get type(){ return TYP_RANGE; }

	/**
	 * @property {number} value - getting a range value
	 * returns a random number in the range, inclusive.
	 */
	get value() {
		return this.min + Math.random()*( this.max - this.min );
	}

	valueOf(){ return this.value; }

	/**
	 *
	 * @param {Object|number|string} min
	 * @param {?number} max
	 */
	constructor(min=0, max=undefined) {

		if ( typeof min === 'string' ) {

			let parts = min.split( SPLIT_CHAR );
			this.min = Number( parts[0] );
			this.max = Number( parts[1] );

		} else if ( typeof min ==='object') Object.assign( this, min );
		else {

			this.min = Number( min );
			this.max = Number( max === undefined ? min : max );

		}

		//console.log('min: ' + this.min + ' -> ' + this.max );


	}

	/**
	 * Add amount to range.
	 * @param {number|Range} amt
	 */
	add( amt ) {

		if ( typeof amt === 'number' ) {
			this.min += amt;
			this.max += amt;
		} else if ( typeof amt ==='object') {
			this.min += amt.min;
			this.max += amt.max;
		}

	}

}