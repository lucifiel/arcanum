export default class Resource {

	/**
	 * @property {Object} def - Object that defines the basics
	 * of the stat. id, name, flavortext, etc.
	 */
	get def() { return this._def; }
	set def(v) { this._def = v; }


	get max() { return this._max; }
	set max(v) { this._max = v; }

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
	 * @property {BigInt} rate - rate of stat change in value/second.
	 */
	get rate() {
		return this._rate;
	}
	set rate(v){
		this._rate = v;
	}

	get mods() {
		return this._mods;
	}
	set mods(v){
		this._mods =v;
	}

	/**
	 * 
	 * @param {?Object} state 
	 */
	constructor( state ){

		if ( state ) Object.assign( this, state );
		if ( this._mods == null ) this._mods = [];

		this._value = this._value || 0;

	}

	update( dt ) {
		this._value += this._rate * dt;
	}

}