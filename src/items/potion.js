import GData from "./gdata";

const defaults = {

	level:1,
	repeat:true,
	stack:true

};

/**
 * This is actually only the prototype for a potion.
 * Individual potions are instanced from this data.
 */
export default class Potion extends GData {

	get crafter() { return true; }

	constructor(vars=null ) {

		super(vars, defaults );

		this.require = this.require||this.unlockTest;

	}

	unlockTest( g, i) {
		return g.herbalism.level >=i.level;
	}

}