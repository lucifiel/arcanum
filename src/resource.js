import Stat from 'stat';
import Item from 'item';

export default class Resource extends Item {

	get require() {
		return super.require || ( ()=>this.positive() );
	}

	/**
	 * @property {BitInt} value
	 */
	get value() {
		return this._value;
	}
	set value(v) {
		this._value = v;
	}

	/**
	 * @property {number} delta - last change in value.
	 */
	get delta() { return this._delta; }
	set delta(v) { this._delta = v; }

	set locked(v){
		if (v)this._delta=0;
		super.locked =v;
	}
	/**
	 * @property {BigInt} rate - rate of stat change in value/second.
	 */
	get rate() {
		return this._rate;
	}
	set rate(v){
		this._rate = ( v instanceof Stat ) ? v : new Stat(v);
	}

	get max() { return this._max; }
	set max(v) { this._max = v instanceof Stat ? v : new Stat(v); }

	get mods() {
		return this._mods;
	}
	set mods(v){
		this._mods =v;
	}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		super(vars);

		if ( this._mods == null ) this._mods = [];

		this._value = this._value || 0;
		this._lastValue = this._value;

		this._delta = 0;

	}

	applyEffect(e) {
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
			if ( m.max ) this.max += m.amx * amt;

		}

	}

	/**
	 * 
	 * @param {Object} m - mod description. 
	 * @param {number} amt - amount removed.
	 */
	removeMod( m, amt ){

		if ( m instanceof Object ) {
	
			console.log('removing mod: ' + this.id );

			if ( m.base ) this.rate.base -= m.base*amt;
			if ( m.pct ) this.rate.pct -= m.pct*amt;
			if ( m.max ) this.max -= m.amx * amt;

		}

	}

	update( dt ) {

		if ( this._rate ) {

			let v = this._value;

			v += this._rate.value * dt;
			if ( v >= this._max ) v = this._max;

			this._delta = v - this._lastValue;

			this._lastValue = this._value = v;

		} else this._delta = 0;

	}

	/**
	 * @returns {boolean} true if resource value is positive.
	 */
	positive(){
		return this._value > 0;
	}

}