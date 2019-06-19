import { defineVars } from 'objecty';

import Item from './item';

export default class Action extends Item {

	get type() { return 'action'; }

	get cost() { return this._cost; }
	set cost(v) { this._cost =v;}

	valueOf(){
		return !this._locked;
	}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		super(vars);

		this.repeat = true;

	}

}