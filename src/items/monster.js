import Item from "./item";
import { getDelay } from '../chars/char';

export default class Monster extends Item {

	constructor(vars=null) {

		super(vars);

		this.level = this.level || 1;
		this.speed = this.speed || this.level;
		this.tohit = this.tohit || this.level;
		this.defense = ( this.defense === null || this.defense === undefined )
								? this.level : this.defense;

		this.delay = getDelay( this.speed );

	}

}