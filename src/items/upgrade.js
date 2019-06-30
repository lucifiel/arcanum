import Item from './item';

export default class Upgrade extends Item {

	constructor( vars=null ) {

		super(vars);
		this._type = this._type || 'upgrade';
	
	}

}