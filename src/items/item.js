import Base, {mergeClass} from './base';
import { mergeSafe} from 'objecty';

/**
 * Carryable or equippable instanced Item.
 * An instanced item can be created, destroyed, discarded, etc.
 */
export default class Item {

	toJSON() {

		let data = this.excludeJSON() || {};

		data.id = this.id;
		data.template = this.template.id;
		data.value = this.value;

		return data ? data : undefined;

	}

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

		if ( this.stack !== false ) this.stack = true;
	}

	maxed(){
		return (this.stack === false &&this.value>0) || ( this.max && this.value >= this.max );
	}

	/**
	 * does nothing.
	 */
	revive( state ){

		console.log('template: ' + this.template);
		if ( typeof this.template ==='string' ) this.template = state.getData( this.template );
		if ( this.template ) {
			console.log('reviving: ' + this.template.name );
			mergeSafe( this, this.template);
		}

	}

}

mergeClass( Item, Base );