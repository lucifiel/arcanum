import Item from './item';

export default class Spell extends Item {


	constructor(vars=null) {

		super(vars);

		this.learned = this.learned || false;

	}

};