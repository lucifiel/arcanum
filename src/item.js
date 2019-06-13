import { defineVars } from 'objecty';

/**
 * Base class of game items.
 */
export default class Item {

	get id() { return this._id; }
	set id(v) { this._id = v;}

	get desc() { return this._desc; }
	set desc(v) { this._desc=v;}

	get name() { return this._name;}
	set name(v) { this._name = v;}

	get requires() { return this._requires; }
	set requires(v) { this._requires =v;}

	get effect() { return this._effect; }
	set effect(v) { this._effect=v;}

	get locked() { return this._locked; }
	set locked(v) { this._locked = v; }

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars ){

		if ( vars ) Object.assign( this, vars );
		defineVars( this, null );

		if ( this._requires || this._locked ) this._locked = true;
		else this._locked = false;

	}

}