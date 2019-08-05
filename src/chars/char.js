import Item from "../items/item";
import Resource from '../items/resource';

/**
 * @constant {number} DELAY_RATE - speed to attack delay conversion constant.
 */
export const DELAY_RATE = 3;
export function getDelay(s) {
	return DELAY_RATE*Math.exp(-s/4);
}


export default class Char extends Item {

	get statuses() { return this._statuses; }
	set statuses(v) { this._statuses = v; }

	get defense() { return this._defense; }
	set defense(v) { this._defense =v; }

	get tohit() { return this._tohit; }
	set tohit(v) { this._tohit = v; }

	/**
	 * @property {number} delay - time between attacks.
	 */
	get delay() { return this._delay; }

	constructor( vars ){

		super(vars);

		this.statuses = this.statuses || {};
		this.immunities = this.immunities || {};

		/**
		 * @property {Object[]} dots - timed/ongoing effects.
		*/
		this.dots = this.dots || [];

	}

	hasStatus(stat) { return this.statuses[stat] > 0; }
	isImmune(kind) { return this.immunities[kind] > 0; }

	addStatus(stat) {
		this.statuses[stat] = this.statuses[stat] ? this.statuses[stat] + 1 : 1;
	}

	removeStatus(stat) {
		this.statuses[stat] = this.statuses[stat] ? this.statuses[stat] - 1 : 0;
	}

	addImmune(kind){
		this.immunities[kind] = this.immunities[kind] ? this.immunities[kind] + 1 : 1;
	}

	removeImmune(kind) {
		this.immunities[kind] = this.immunities[kind] ? this.immunities[kind] - 1 : 0;
	}

}