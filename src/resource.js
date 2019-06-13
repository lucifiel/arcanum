export default class Resource {

	/**
	 * @property {Object} def - Object that defines the basics
	 * of the stat. id, name, flavortext, etc.
	 */
	get def() { return this._def; }
	set def(v) {
		this._def = v;
		if ( v.value ) this._value = v.value;
	}

	get id() { return this._def.id; }
	get name() { return this._def.name || this._def.id; }
	get desc() { return this._def.desc; }

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

	get locked() { return this._locked; }
	set locked(v) { this._locked = v;}

	/**
	 * 
	 * @param {?Object} state 
	 */
	constructor( state ){

		if ( state ) Object.assign( this, state );
		if ( this._mods == null ) this._mods = [];

		this._value = this._value || 0;
		if ( this._requires || this._locked ) this._locked = true;
		else this._locked = false;

	}

	applyEffect(e) {
	}

	update( dt ) {
		if ( this._rate ) this._value += this._rate * dt;
	}

}