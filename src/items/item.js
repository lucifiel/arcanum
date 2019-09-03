import Base, {mergeClass} from './base';

/**
 * Carryable or equippable item.
 */
export default class Item {

	/**
	 * @property {boolean} consume - whether the item is consumed on use.
	 */
	get consume() { return this._consume; }
	set consume(v) { this._consume = v;}

	constructor( vars=null ) {

		if ( vars ) Object.assign( this, vars );

	}
}

mergeClass( Item, Base );