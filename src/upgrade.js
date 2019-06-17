import Item from 'item';

export default class Upgrade extends Item {

	get type() { return 'upgrade'; }

	get cost() { return this._cost; }
	set cost(v) { this._cost=v;}

	get repeat() { return this._repeat; }
	set repeat(v) { this._repeat = v || false;}

	constructor( vars=null ) {

		super(vars);
	
	}

}