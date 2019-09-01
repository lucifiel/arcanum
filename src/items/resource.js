import ModStat from '../modStat';
import Item from './item';

export default class Resource extends Item {

	get require() {
		return super.require ||
		( !this._locked ? null : ()=>this.positive() );
	}
	set require(v){super.require = v;}

	/**
	 * @property {number} current - identical to value except uses floor of values.
	 */
	get current() { return this.unit ? Math.floor(this.value) : this._value; }

	/**
	 * @property {number} value
	 */
	get value() { return this._value; }
	set value(v) {

		this._value = v >= 0 ? v : 0;

	}
	valueOf(){ return this._value; }

	/**
	 * @property {number} delta - last change in value.
	 */
	get delta() { return this._delta; }
	set delta(v) { this._delta = v; }

	/**
	 * @property {ModStat} max - maximum resource value.
	 */
	get max() { return this._max; }
	set max(v) {

		if ( this._max == null ) {

			this._max = new ModStat(v);

		} else {
			this._max.base = v;
		}

	}

	/**
	 *
	 * @param {?Object} [vars=null]
	 */
	constructor( vars=null ){

		super(vars);

		this._value = this._value || 0;

		/**
		 * @property {boolean} unit - true if current value is reported in integer amounts.
		 */
		if ( this.unit === null || this.unit === undefined ) this.unit = true;

		if ( this._rate === null || this.rate === undefined ) this._rate = new ModStat(0);

		this._lastValue = this._value;

		this._type = this._type || 'resource';

		this._delta = 0;

	}

	/**
	 * @returns {boolean} true if an unlocked item is at maximum value.
	 */
	maxed() {

		return this.max ? (this._value >= this.max) : false;

	}


	/**
	 * Not currently used any more.
	 * @param {} dt
	 */
	update( dt ) {

		if ( this._rate.value ) {

			let v = this._value + this._rate.value*dt;

			if ( this._max && v > this._max.value ) v = this._max.value;
			else if ( v < 0 ) v = 0;

			this._delta = v - this._lastValue;

			this._value = this._lastValue = v;

		} else this._delta = 0;

	}

	/**
	 * @returns {boolean} true if resource value is positive.
	 */
	positive(){
		return (this._value > 0 || (this._rate.value>0&&(!this.max||this.max.value>0) ) );
	}

}