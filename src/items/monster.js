import GData from "./gdata";

export default class Monster extends GData {

	constructor(vars=null) {

		super(vars);

		this.level = this.level || 1;
		this.hp = this.hp || (2*this.level);
		this.speed = this.speed || this.level;
		this.tohit = this.tohit || this.level;
		this.defense = ( this.defense === null || this.defense === undefined )
								? this.level : this.defense;

	}

}