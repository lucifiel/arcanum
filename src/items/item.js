import Base, {mergeClass} from './base';

/**
 * Carryable or equippable instanced Item.
 * An instanced item can be created, destroyed, discarded, etc.
 */
export default class Item {

	/**
	 * @property {string} protoId - id of item template used to instance this item.
	 */
	get protoId() { return this.template?  this.template.id : this._id; }

	/**
	 * @property {boolean} consume - whether the item is consumed when used.
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

	maxed(){
		return (this.repeat === false &&this.value>0) || ( this.max && this.value >= this.max );
	}

	/**
	 * does nothing.
	 */
	revive(){}

}

mergeClass( Item, Base );