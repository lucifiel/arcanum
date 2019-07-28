import Item from "./item";
import { getDelay } from '../chars/player';

export default class Monster extends Item {

	constructor(vars=null) {

		super(vars);

		this.level = this.level || 1;
		this.speed = this.speed || this.level;

		this.delay = getDelay( this.speed );

	}

}