import Wearable from "./wearable";
import Stat from "../stat";
import Base, {mergeClass} from '../items/base';
import Item from "../items/item";
import Npc from "./npc";

export default class Inventory {

	/**
	 * @property {number} length - items in inventory.
	 */
	get count() { return this.items.length; }

	valueOf() { return this.items.length; }

	toJSON(){
		return {
			items:(this.items),
			max:(this.max)
		}
	}

	get max() { return this._max; }
	set max(v) {
		this._max = v instanceof Stat ? v : new Stat(v);
	}

	constructor(vars=null){

		if ( vars ) Object.assign(this,vars);

		if ( !this.items ) this.items = [];

		this.type = this.id = 'inventory';

		this._max = this._max || 0;

	}

	revive(state){

		for( let i = this.items.length-1; i>= 0; i-- ) {

			var it = this.items[i];

			var orig = it.template;
			if ( typeof orig === 'string') orig = state.getData( orig );
			if ( !orig) {
				console.warn('inv. bad item type: ' + it.id + ' -> ' + it.template );
				continue;
			}
			it.template = orig;

			var type = orig.type;
			if ( type == null ) {
				console.warn( 'Unknown Item type: '+ it.type + ' -> ' + it.template + ' -> ' + it.protoId );
			}

			if ( type === 'armor' || type === 'weapon' || type === 'wearable') {

				it = this.items[i] = new Wearable(it);

			} else if ( type === 'monster') {
				it = this.items[i] = new Npc(it);
			} else {
				console.log('default revive: ' + it.id );
				it = this.items[i] = new Item(it);
			}

			it.revive( state );

		}

		// todo: reassign items for Vue reactivity?

	}

	add(it){

		if ( it === null || it === undefined || typeof it === 'boolean' || this.full() ) return false;
		if ( Array.isArray(it) ) {

			//this.items = this.items.concat(it);
			for( let i = it.length-1; i>=0; i-- ) {
				var sub = it[i];
				if ( sub === null || sub === undefined || typeof sub === 'boolean') continue;
				this.items.push( sub );
			}

		} else {

			if ( it.stack ) {
				let inst = this.find( it.id, true );
				if ( inst && inst !== it ){
					inst.value++;
					return inst;
				}
			}
			this.items.push(it);

		}
		this.dirty = true;

	}

	includes(it) {
		return this.items.includes(it);
	}

	/**
	 * @returns {number} number of free spaces left.
	 */
	freeSpace() {
		return this.max ? this.max - this.items.length : Number.MAX_SAFE_INTEGER;
	}

	/**
	 * @returns {boolean} true if inventory full.
	 */
	full(){
		//console.log('full: ' + ( this.max >0 && this.items.length >= this.max));
		return this.max >0 && this.items.length >= this.max;
	}

	/**
	 * Filter inventory items.
	 * @param {*} p
	 */
	filter(p) {
		return this.items.filter(p);
	}

	/**
	 * Attempt to find item in inventory.
	 * @param {string} id,
	 * @param {boolean} proto - whether to find any item instanced from the prototype id.
	 * If false, only an exact id match is returned.
	 */
	find(id, proto=false ) {
		console.log('find id: ' + id );
		return proto === true ? this.items.find( v=>v.id===id||v.protoId===id) :
			this.items.find( v=>v.id===id);
	}

	/**
	 * Remove all items from inventory.
	 * splice is used for vue reactivity.
	 */
	clear() {
		this.items.splice(0, this.items.length);
	}

	removeAt(ind) {
		this.items.splice(ind,1);
	}

	/**
	 *
	 * @param {Item} it
	 */
	remove( it ){

		let ind = this.items.indexOf( it );
		if ( ind < 0 ) return;
		this.items.splice( ind, 1 );

	}

}

mergeClass( Inventory, Base );