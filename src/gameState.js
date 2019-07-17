import Inventory from './inventory';
import Raid from './chars/raid';
import Item from './items/item';
import Equip from './chars/equip';

/**
 * @const {number} MAX_QUICK_SLOTS - maximum number of quickslots.
 */
const MAX_QUICK_SLOTS = 10;

export default class GameState {

	toJSON(){
		return JSON.stringify( this );
	}

	constructor(vars=null ){

		if ( vars ) Object.assign( this, vars );

		/**
		 * @property {Item} curAction - ongoing action.
		 */
		this.curAction = this.curAction || null;

		/**
		 * @property {Item} curHome
		 */
		this.curHome = this.curHome || null;

		/**
		 * @property {string} restId - id of action to use for resting.
		 */
		this.restId = this.restId || 'rest';

		this.quickslots = this.quickslots || [];

		/**
		 * @property {string} restAction - default resting action.
		 */
		this.restAction = this.getItem( this.restId );

		this.inventory = this.inventory || new Inventory();
		this.equip = this.equip || new Equip();

		/**
 		* @property {number} sellRate - percent of initial cost
 		* items sell for.
 		*/
		this.sellRate = this.sellRate || 0.5;

		/**
		 * @property {Object[]} dots - timed/ongoing effects.
		 */
		this.dots = this.player.dots;

		/**
		 * @property {Object.<string,number>} counts - counts of all items, including
		 * counts of tagged items ( for tag requirements. )
		 */
		//this.counts = {};

		/**
		 * @property {Object.<string,Item[]>} tagLists - tag to array of items with tag.
		 * makes upgrading/referencing by tag easier.
		 */
		this.tagLists = this.tagLists || {};

		this.events = this.events || {};

		this.raid = this.raid || new Raid();
		this.raid.initState( this );

	}

	/**
	 * 
	 * @param {Item} it 
	 * @param {number} ind 
	 */
	setQuickSlot( it, ind=-1 ) {

		// NOTE: using splice for Vue reactivity.
		if ( ind >= 0 && ind <=10 ) this.quickslots.splice(ind,1, it );
		else {

			if ( this.quickslots.length <= MAX_QUICK_SLOTS ) this.quickslots.push(it);
			else this.quickslots.splice( MAX_QUICK_SLOTS-1, 1, it );

		}

	}

	/**
	 * 
	 * @param {string} tag
	 * @returns {Item[]|undefined}
	 */
	getTagList( tag ) {
		return this.tagLists[tag];
	}

	/**
	 * Get the amount of a specific item subtype
	 * required to buy.
	 * @param {string} type
	 * @returns {number}
	 */
	typeCost( cost, type ) {

		if ( !cost ) return 0;

		if ( !isNaN( cost) ) return type === 'gold' ? cost : 0;
		return ( cost.hasOwnProperty(type) ) ? cost[type] : 0;
	}

	/**
	 * Add to maximum value of resource.
	 * Used for implementing testing cheats.
	 * @param {string} id 
	 * @param {number} amt 
	 */
	addMax( id, amt=10) {

		console.log('adding max');
		let it = this.getItem(id);
		if ( !it) return;

		it.max += amt;
	}

	fillItem( id ) {

		let it = this.getItem(id);
		if ( !it) return;

		it.value = it.max.value;

	}

	/**
	 * 
	 * @param {(it)=>boolean} pred 
	 */
	filterItems( pred ) {
		let a = [];
		let items = this.items;
		for( let p in items ) {
			if ( pred( items[p] ) ) a.push( items[p] );
		}
		return a;
	}

	/**
	 * Return a list of items containing given tags.
	 * @param {string[]} tags
	 * @returns {Item[]}
	 */
	filterByTag( tags ) {

		let a = [];
		for( let p in this.items ) {
			if ( this.items[p].hasTags(tags) ) a.push(this.items[p]);
		}
		return a;
	
	}
	
	/**
	 * Assign all items passing the predicate test the given tag.
	 * @param {Predicate} test 
	 * @param {string} tag 
	 */
	tagItems( test, tag ) {
		let items = this.items;
		for( let p in items ) {
			if ( test( items[p] ) ) items[p].addTag(tag);
		}
	}

	/**
	 * Get an item on an item-id varpath.
	 * @param {VarPath} v 
	 */
	getPathItem(v){
		return v.readVar( this._items );
	}

	getItem(id) { return this.items[id];}

}