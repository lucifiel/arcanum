import { defineVars } from 'objecty';

import Item from 'item';

export default class Action extends Item {

	get cost() { return this._cost; }
	set cost(v) { this._cost =v;}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		super(vars);

	}

}