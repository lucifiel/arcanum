export default class Resource {

	/**
	 * @property {Object} def - Object that defines the basics
	 * of the stat. id, name, flavortext, etc.
	 */
	/*get def() { return this._def; }
	set def(v) {

		this._def = v;
		if ( v.value ) this._value = v.value;

	}*/

	get id() { return this._id; }
	set id(v) { this._id = v;}

	get name() { return this._name || this._id; }
	set name(v) { this._name = v;}

	get desc() { return this._desc; }
	set desc(v) { this._desc=v;}

	get max() { return this._max; }
	set max(v) { this._max = v; }

	get require() {
		return this._require || ( ()=>this.positive() );
	}
	set require(v) { this._require =v;}

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
	 * @param {?Object} [state=null] 
	 */
	constructor( state=null ){

		if ( state ) Object.assign( this, state );
		if ( this._mods == null ) this._mods = [];

		this._locked = this._locked !== undefined ? this._locked : true;

		this._value = this._value || 0;

	}

	/**
	 * @returns {boolean} true if resource value is positive.
	 */
	positive(){
		return this.value > 0;
	}

	applyEffect(e) {
	}

	update( dt ) {
		if ( this._rate ) this._value += this._rate * dt;
	}

}