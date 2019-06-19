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
	get value() { return this._value; }
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
	 */
	get max() { return this._max; }
	set max(v) {

		this._max = v instanceof Stat ? v : (
			!v ? null : new Stat( v )
		);

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

	/**
	 * 
	 * @param {Object} m - mod description. 
	 * @param {number} amt - amount added.
	 */
	addMod( m, amt ) {

		if ( m instanceof Object ) {

			if ( m.base ) this.rate.base += m.base*amt;
			if ( m.pct ) this.rate.pct += m.pct*amt;
			if ( m.max ) {

				let vars = m.max;
				if ( !isNaN(vars) ) this.max.base += vars * amt;
				else if (vars instanceof Object ) {

					if ( vars.base ) this.max.base += vars.base*amt;
					if ( vars.pct ) this.max.pct += vars.pct*amt;
				}

			}

		}

	}

	/**
	 * 
	 * @param {Object} m - mod description. 
	 * @param {number} amt - amount removed.
	 */
	removeMod( m, amt ){

		if ( m instanceof Object ) {

			if ( m.base ) this.rate.base -= m.base*amt;
			if ( m.pct ) this.rate.pct -= m.pct*amt;
			if ( m.max ) {

				let vars = m.max;
				if ( !isNaN(vars) ) this.max.base -= vars * amt;
				else if (vars instanceof Object ) {

					if ( vars.base ) this.max.base -= vars.base*amt;
					if ( vars.pct ) this.max.pct -= vars.pct*amt;
				}

			}

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