import { defineExcept } from 'objecty';

/**
 * @typedef {Object} Effect
 * @property {?number} duration
 */

 /**
  * @const {string[]} Reserved - reserved prop names on effects/mods.
  */
export const Reserved = [
	'skipLocked', 'duration'
];

/**
 * Base class of game items.
 */
export default class Item {

	/**
	 * @property {string} type
	 */
	get type() { return 'item'; }

	/**
	 * @property {string} id
	 */
	get id() { return this._id; }
	set id(v) { this._id = v;}

	/**
	 * @property {string} name
	 */
	get name() { return this._name || this._id;}
	set name(v) { this._name = v;}

	/**
	 * @property {string} desc
	 */
	get desc() { return this._desc; }
	set desc(v) { this._desc=v;}

	/**
	 * @property {number} value
	 */
	get value() { return this._value; }
	set value(v) { this._value = v;}

	/**
	 * @property {string|string[]} tag - tag to distinguish between
	 * item subtypes.
	 */
	get tags() { return this._tags;}
	set tags(v) {

		if ( typeof v === 'string') this._tags = v.split(',');
		else this._tags = v;

	}

	get require() { return this._require; }
	set require(v) { this._require =v;}

	get effect() { return this._effect; }
	set effect(v) { this._effect=v;}

	/**
	 * @property {boolean} locked
	 */
	get locked() { return this._locked; }
	set locked(v) { this._locked = v; }

	/**
	 * @property {string|string[]} unlocks - items to force unlock.
	 * only use for simple unlocks. require on target for complex.
	 */
	get unlocks() { return this._unlocks;}
	set unlocks(v) { this._unlocks = v; }

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );
	
		if ( this._locked === undefined ) this._locked = true;

		defineExcept( this, null, ['require', 'must', 'buy', 'cost', 'name', 'effect']);

	}

	/**
	 * Get the amount of a specific item subtype
	 * required to buy.
	 * @param {string} type 
	 */
	typeCost( type ) {

		if ( !this.cost ) return 0;

		if ( !isNaN( this.cost) ) return type === 'gold' ? this.cost : 0;
		return ( this.cost.hasOwnProperty(type) ) ? this.cost[type] : 0;
	}

	applyEffect(e) {
	}

	updateDot(e, dt) {
	}

	addTag( tag ) {
		if ( !this._tags) this._tags = [];
		this._tags.push(tag);
	}

	/**
	 * 
	 * @param {string[]} a - array of tags to test.
	 */
	hasTags( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return false;

		return true;

	}

	/**
	 * Test if any tag in the list is matched.
	 * @param {string[]} a - array of tags to test.
	 */
	anyTag( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return true;

		return false;

	}

	/**
	 * 
	 * @param {string} t - tag to test. 
	 */
	hasTag( t ) {
		return this._tags && this._tags.includes(t);
	}

}