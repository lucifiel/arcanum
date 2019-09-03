export const PercentTest = /^(\d+(?:\.?\d+))\%$/i

/**
 * Represents a percentage probability.
 */
export default class Percent {

	toJSON(){ return (100*this.pct) + '%'; }

	/**
	 * @property {number} pct - decimal percent.
	 */

	/**
	 * @property {boolean} value - returns true
	 * if a random roll is beneath the percent.
	 */
	get value() {
		return Math.random() < this.pct;
	}

	toString() { return (100*this.pct) + '%';}

	constructor( val ) {

		if ( typeof val === 'string') {

			let res = PercentTest.exec( val );
			if ( res ) {

				this.pct = res[1];

			} else this.pct = Number(val);

		} else if ( !isNaN(val) ) this.pct = val;

		this.pct = ( this.pct || 0 )/100;

	}

}