import Item from './item';

export default class Upgrade extends Item {

	get type() { return 'upgrade'; }

	constructor( vars=null ) {

		super(vars);
	
	}

}