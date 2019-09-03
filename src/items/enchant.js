import Action from './action';

export default class Enchant extends Action {

	/**
	 * @property {string} target - target type, name, kind, or tag, to which
	 * the enchantment can be applied.
	 */
	get target(){return this._target;}
	set target(v){this._target=v;}

	constructor(vars){

		super(vars);

		this.level = this.level || 0;
		this.need = this.need || 'enchantsource';

	}

	/**
	 * Called when enchant is being used on target.
	 * @param {*} it
	 */
	usingWith( it ) {
		it.enchants = (it.enchants || 0) + this.level;
	}

	/**
	 * Test if enchantment can be applied to target item.
	 * @param {Item} it
	 */
	canApply( it ) {

		if ( it.enchants + this.level > it.level ) return false;

		let t = this._target;
		return !t || it.type === t || it.kind === t || it.hasTag(t);

	}

}