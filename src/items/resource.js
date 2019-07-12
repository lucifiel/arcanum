import Stat from '../stat';
import Item from './item';

export default class Resource extends Item {

	get require() {
		return super.require ||
		( this._locked === 0 ? null : ()=>this.positive() );
	}
	set require(v){super.require = v;}

	/**
	 * @property {number} value
	 */
	get value() { return this._value || 0; }
	set value(v) {
		if ( this._max && v > this._max.value ) v = this._max.value;
		else if ( v < 0 ) v = 0;
		this._value = v;
	}
	valueOf(){ return this._value; }

	/**
	 * @property {number} delta - last change in value.
	 */
	get delta() { return this._delta; }
	set delta(v) { this._delta = v; }

	/**
	 * @property {Stat} max - maximum resource value.
	 * @note reversed props start filled to max, any addition to max
	 * adds an equal amount to value.
	 */
	get max() { return this._max; }
	set max(v) {

		if ( !this._max ) {

			this._max = new Stat(v);
			if ( this.reverse ) {
				this.value += this._max.value;
			}

		} else {

			if ( this.reverse ) {

				var lastMax = this._max.value;
				this._max.base = v;
				this.value += ( this._max.value - lastMax );

			} else this._max.base = v;

		}

	}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		super(vars);

		this._value = this._value || 0;
		if ( this._max === undefined ) this.max = 0;
		if ( this._rate == null ) this._rate = new Stat(0);

		this._lastValue = this._value;

		this._type = this._type || 'resource';

		this._delta = 0;

	}

	update( dt ) {

		if ( this._rate ) {

			let v = this._value + this._rate.value*dt;

			if ( this._max && v > this._max.value ) v = this._max.value;
			else if ( v < 0 ) v = 0;

			this._delta = v - this._lastValue;

			this._lastValue = this._value = v;

		} else this._delta = 0;

	}

	/**
	 * @returns {boolean} true if resource value is positive.
	 */
	positive(){
		return (this._value > 0 || (this._rate.value>0&&this._value===0) );
	}

}