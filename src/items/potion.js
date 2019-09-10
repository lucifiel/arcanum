import GData from "./gdata";

/**
 * This is actually only the prototype for a potion.
 * Individual potions are instanced from this data.
 */
export default class Potion extends GData {

	constructor(vars=null) {

		super(vars);
		this.level = this.level || 1;
		this.require = this.require||this.unlockTest;
		if ( this.stack !== false ) this.stack = true;

	}

	unlockTest( g, i) {
		return g.herbalism.level >=i.level;
	}

}