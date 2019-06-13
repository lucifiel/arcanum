export default class Resource {

	/**
	 * @property {Object} def - Object that defines the basics
	 * of the stat. id, name, flavortext, etc.
	 */
	get def() { return this._def; }
	set def(v) {
		this._def = v;
		console.log('def valu: ' + v.value );
		if ( v.value ) this.value = v;
	}

	get id() { return this._def.id; }
	get name() { return this._def.name; }
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

	/**
	 * 
	 * @param {?Object} state 
	 */
	constructor( state ){

		if ( state ) Object.assign( this, state );
		if ( this._mods == null ) this._mods = [];

		this._value = this._value || 0;

	}

	applyEffect(e) {
	}

	update( dt ) {
		this._value += this._rate * dt;
	}

}