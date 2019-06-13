import { defineVars } from 'objecty';

export default class Action {

	/**
	 * @property {Object} def - Object that defines the basics
	 * of the stat. id, name, flavortext, etc.
	 */
	//get def() { return this._def; }
	//set def(v) { this._def = v; }

	get effect() {return this._effect }
	set effect(v) { this._effect = v;}

	get id(){return this._id;}
	set id(v) { this._id=v;}

	get cost() { return this._cost; }
	set cost(v) { this._cost =v;}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );

		//defineVars( this, null );

	}

}