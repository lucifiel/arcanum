import GData from "./gdata";
import Stat from "../stat";
import Range from "../range";

const defaults = {

	level:1,
	buy:(it)=>new Stat(200*( it.level||1) ),
	locked:false

};

export default class Monster extends GData {

	get defaults() { return defaults; }

	get isProto() {return true; }

	toJSON() {
		if ( this.value > 0 ) return { value:this.value};
		else return undefined;
	}

	constructor(vars=null) {

		super(vars, defaults );

		this.type = 'monster';

		this.hp = this.hp || (2*this.level);
		this.speed = this.speed || this.level;
		this.tohit = this.tohit || this.level;
		this.defense = ( this.defense === null || this.defense === undefined )
								? this.level : this.defense;

		console.log('PARSE MONSTER: ' + this.id );

		for( let p in this.loot ) {

			var l = this.loot[p];
			if ( l instanceof Range) console.log(p + ' ALREADY RANGE');
		}


	}

	maxed() { return false; }

}