import GData from "./gdata";
import Stat from "../stat";

const defaults = {

	level:1,
	locked:false

};

/**
 * Sublocation of a Locale
 */
export default class Area extends GData {

	get isProto() {return true; }

	toJSON() {
		if ( this.value > 0 ) return { value:this.value};
		else return undefined;
	}

	clone() { return new Area( this ); }

	constructor(vars=null) {

		super(vars );

		this.type = 'area';

		this.level = this.level || 1;
		this.delay = this.level;

	}

	maxed() { return false; }

}