import Action from './action';
import Game from '../game';

export default class Enchant extends Action {

	/**
	 * @property {string} target - target type, name, kind, or tag, to which
	 * the enchantment can be applied.
	 */
	get target(){return this._target;}
	set target(v){this._target=v;}

	constructor(vars){

		super(vars);

	}

	/**
	 * Test if enchantment can be applied to target.
	 * @param {Item} target
	 */
	canApply( target ) {

		let t = this._target;
		return !t || target.type === t || target.kind === t || target.hasTag(t);

	}

	complete(){
		Game.doRest();
	}

}