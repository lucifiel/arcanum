import Item from "./item";

export default class Wearable extends Item {

	constructor(vars=null){

		super(vars);
		this.type = 'wearable';

	}

}