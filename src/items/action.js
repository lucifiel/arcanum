// Type not required.

/**import Item from './item';

export default class Action extends Item {

	get type() { return 'action'; }

	get cost() { return this._cost; }
	set cost(v) { this._cost =v;}

	valueOf(){
		return !this._locked;
	}

	constructor( vars=null ){

		super(vars);

		this.repeat = true;

	}

}*/