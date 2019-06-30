import Raid from './raid';

import Sections from 'data/sections.json';

export default class GameState {

	constructor(vars=null ){

		if ( vars ) Object.assign( this, vars );

		/**
		 * @property {Item} curAction - ongoing action.
		 */
		this.curAction = this.curAction || null;

		this.dungeon = this.dungeon || null;

		this.curEnemy = this.curEnemy || null;

		this.sections = Sections;

		/**
		 * @property {Object[]} dots - timed/ongoing effects.
		 */
		this.dots = this.dots || [];

		this.flags = this.flags || {};

		this.events = this.events || {};

		/**
		* @property {Object} completed - completed events.
		*/
		this.completed = this.completed || {};

		this.raid = this.raid || new Raid();
		this.raid.initState( this );

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