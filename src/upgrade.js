import Item from 'item';

export default class Upgrade extends Item {

	get cost() { return this._cost; }
	set cost(v) { this._cost=v;}

	constructor( vars=null ) {

		super(vars);
	
	}

}