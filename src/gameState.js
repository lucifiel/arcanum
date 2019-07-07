import Raid from './raid';
import Item from './items/item';

import Sections from 'data/sections.json';

export default class GameState {

	constructor(vars=null ){

		if ( vars ) Object.assign( this, vars );

		/**
		 * @property {Item} curAction - ongoing action.
		 */
		this.curAction = this.curAction || null;

		/**
		 * @property {string} restId - id of action to use for resting.
		 */
		this.restId = this.restId || 'rest';

		/**
		 * @property {string} restAction - default resting action.
		 */
		this.restAction = this.getItem( this.restId );

		this.dungeon = this.dungeon || null;

		this.curEnemy = this.curEnemy || null;

		for( let i = Sections.length-1; i>=0; i-- ) {
			Sections[i] = new Item( Sections[i] );
		}
		this.sections = Sections;

		/**
 		* @property {number} sellRate - percent of initial cost
 		* items sell for.
 		*/
		this.sellRate = this.sellRate || 0.5;

		/**
		 * @property {Object[]} dots - timed/ongoing effects.
		 */
		this.dots = this.dots || [];

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