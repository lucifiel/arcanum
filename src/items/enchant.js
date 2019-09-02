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
	 * Test if enchantment can be applied to target item.
	 * @param {Item} it
	 */
	canApply( it ) {

		let t = this._target;
		return !t || it.type === t || it.kind === t || it.hasTag(t);

	}

	complete(){
		Game.doRest();
	}

}