export const PercentTest = /^(\d+(?:\.?\d+))\%$/i

/**
 * Represents a percentage probability.
 */
export default class Percent {

	toJSON(){return this.pct + '%'; }
	/**
	 * @property {boolean} value - returns true
	 * if a random roll is beneath the percent.
	 */
	get value() {
		return 100*Math.random() < this.pct;
	}

	constructor( val ) {

		if ( typeof val === 'string') {

			let res = PercentTest.exec( val );
			if ( res ) {

				this.pct = res[1];

			} else this.pct = Number(val);

		} else if ( !isNaN(val) ) this.pct = val;

		this.pct = this.pct || 0;

	}

}