import Stat from '../stat';
import Item from './item';

export default class Resource extends Item {

	get require() {
		return this._require ||
		( this._locked === false ? null : ()=>this.positive() );
	}
	set require(v){this._require =v;}

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
	 * @property {Stat} rate - rate of stat change in value/second.
	 */
	get rate() { return this._rate; }
	set rate(v){ this._rate = ( v instanceof Stat ) ? v : new Stat(v); }

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

			var lastMax = this.reverse ? this._max.value : 0;
			this._max.add(v);

			if ( this.reverse ) {
				this.value += ( this._max.value - lastMax );
				console.log('assigning reverse ' + this.name + ': ' + this.value );
			}

		}

	}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		super(vars);

		this._value = this._value || 0;
		this._lastValue = this._value;

		this._delta = 0;

	}

	applyEffect(e) {

		if ( e instanceof Object ){

			if ( this.locked && e.skipLocked ) return;
			if ( e.value ) this.value += e.value;

		}

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
		return (this.decimal && this._value > 0) || this._value >= 1;
	}

}