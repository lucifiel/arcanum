import Item from "./item";

export default class Monster extends Item {

	constructor(vars=null) {

		super(vars);

		this.speed = this.speed || this.level;
		this.level = this.level || 1;

		this.delay = 10 / this.speed;

	}

}