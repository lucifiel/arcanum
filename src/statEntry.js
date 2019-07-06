import Stat from './stat';

/**
 * Facilitates updates of stats.
 */
export default class StatEntry {

	getValue() { return this.stat.value; }

	get base() { return this.stat.base; }
	set base(v) {
		this.stat.base = v;
	}

	/**
	 * @property {string[]} subpath - subpath from the base stat
	 * which the entry key refers to.
	 */

	constructor( key, stat, subpath=undefined ){

		this.key = key || '';
		this.stat = stat;
		this.subpath = subpath;

		this.owner = this.owner || null;

	}

}