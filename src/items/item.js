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

	/**
	 * @property {boolean} stack - whether the item should stack.
	 */
	get stack() { return this._stack; }
	set stack(v) { this._stack = v; }

	constructor( vars=null ) {

		if ( vars ) Object.assign( this, vars );
		if ( this.consume === null || this.consume === undefined ) this.consume = true;

	}
}

mergeClass( Item, Base );