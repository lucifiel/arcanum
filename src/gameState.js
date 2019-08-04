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

		let data = {

			items:( this.items ),
			quickslots:this.quickslots.map(v=> v ? v.id : null ),
			curAction: this.curAction ? this.curAction.id : undefined,
			curHome: this.curHome ? this.curHome.id : undefined,
			equip:( this.equip ),
			inventory:( this.inventory ),
			raid:( this.raid ),
			sellRate:this.sellRate,
			restAction:this.restAction.id,
			NEXT_ID:this.NEXT_ID

		};

		return data;

	}

	nextId() {
		return this.NEXT_ID++;
	}

	/**
	 * 
	 * @param {Object} baseData - base game data.
	 */
	constructor( baseData, restore=false ){

		Object.assign( this, baseData );

		/**
		 * Next item id.
		 */
		this.NEXT_ID = this.NEXT_ID || 0;

		/**
		 * @property {Item} curAction - ongoing action.
		 */
		this.curAction = this.curAction || null;

		/**
		 * @property {Item} curHome
		 */
		this.curHome = this.curHome || null;

		/**
		 * @property {string} restAction - default resting action.
		 */
		this.restAction = this.restAction || this.getItem( 'rest' );

		this.quickslots = this.quickslots || [];

		this.initMaterials( this.materials );
		this.inventory = new Inventory( baseData.inventory );
		this.equip = new Equip( baseData.equip );

		/**
 		* @property {number} sellRate - percent of initial cost
 		* items sell for.
 		*/
		this.sellRate = this.sellRate || 0.5;

		this.raid = new Raid( baseData.raid );
		this.raid.initState( this );

		if ( restore ) this.revive();

		/**
		 * @property {Object.<string,Item[]>} tagLists - tag to array of items with tag.
		 * makes upgrading/referencing by tag easier.
		*/
		this.tagLists = this.makeLists( this.items );

	}

	initMaterials( mats ) {

		let byId = {};
		for( let i = mats.length-1; i>=0; i-- ) {
			byId[ mats[i].id] = mats[i];
		}

		this.matsById = byId;

	}

	revive() {

		if ( this.curHome ) this.curHome = this.getItem(this.curHome );
		if ( this.curAction ) {
			this.curAction = this.getItem( this.curAction );
			if ( this.curAction.type === 'dungeon') this.curAction = this.raid;
		}

		if ( this.quickslots ) {
			this.quickslots = this.quickslots.map( v=>this.getItem(v) );
		}

		this.equip.revive( this );
		this.inventory.revive( this );

		this.player.revive(this);

	}

	mergeItems( dest, src ) {

		let it;
		for( let p in src ) {

			it = dest[p];
			if ( !it ) {
				console.warn(`Attempt to revive undefined object: ${p}` );
				dest[p] = src[p]
			} else if ( it.hasOwnProperty('reviver' ) ) {

				it.reviver( dest, src[p] );

			} else Object.assign( dest[p], src[p] );

		}

	}

	/**
	 * Create lists of tagged items.
	 * @param {Object.<string,Item>} items
	 * @returns {Object.<string,Item[]>} lists 
	 */
	makeLists( items ) {

		var lists = {};

		for( let p in items ) {

			var it = items[p];
			var tags = it.tags;
			if ( !tags ) continue;

			for( var t of tags ){

				var list = lists[t];
				if ( !list ) lists[t] = list = [];
				list.push( it );

			}

		}

		return lists;

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
		if ( !it || !it.max ) return;

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

	getMaterial(id) { return this.matsById[id]; }

}