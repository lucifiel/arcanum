import { defineExcept } from 'objecty';

/**
 * Base class of game items.
 */
export default class Item {

	get id() { return this._id; }
	set id(v) { this._id = v;}

	get name() { return this._name;}
	set name(v) { this._name = v;}

	get desc() { return this._desc; }
	set desc(v) { this._desc=v;}

	/**
	 * @property {string} tag - tag to distinguish between
	 * item subtypes.
	 */
	get tag() { return this._tag;}
	set tag(v) { this._tag = v;}

	get require() { return this._require; }
	set require(v) { this._require =v;}

	get effect() { return this._effect; }
	set effect(v) { this._effect=v;}

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

}