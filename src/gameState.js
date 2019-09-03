import Inventory from './chars/inventory';
import Raid from './composites/raid';
import GData from './items/gdata';
import Equip from './chars/equip';
import Runnable from './composites/runnable';

export default class GameState {

	toJSON(){

		let slotIds = {};
		for( let p in this.slots ) {
			if ( this.slots[p] ) slotIds[p] = this.slots[p].id;
		}

		let data = {

			items:( this.items ),
			quickslots:this.quickslots.map(v=> v ? v.id : null ),
			curAction: this.curAction ?  ( this.curAction instanceof Runnable ?
				this.curAction : this.curAction.id ) : undefined,
			slots:slotIds,
			equip:( this.equip ),
			raid:( this.raid ),
			sellRate:this.sellRate,
			restAction:this.restAction ? this.restAction.id : null,
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
		 * @property {Object.<string,Item>} slots - slots for items which can only have
		 * a single active at a given time.
		 */
		this.slots = this.slots || {
			'home':null,
			'mount':null,
			'bed':null
		}

		/**
		 * @property {string} restAction - default resting action.
		 */
		this.restAction = this.restAction || this.getData( 'rest' );

		this.quickslots = this.quickslots || [];

		this.initMaterials( this.materials );

		this.inventory = new Inventory( this.items.inv || baseData.inventory || {max:3} );
		this.items.inv = this.inventory;

		this.equip = new Equip( baseData.equip );

		/**
 		* @property {number} sellRate - percent of initial cost
 		* items sell for.
 		*/
		this.sellRate = this.sellRate || 0.5;

		this.raid = new Raid( baseData.raid );
		this.raid.revive( this );

		if ( restore ) this.revive();

		/**
		 * @property {Object.<string,Item[]>} tagLists - tag to array of items with tag.
		 * makes upgrading/referencing by tag easier.
		*/
		this.tagLists = this.makeLists( this.items );

		for( let p in this.items ) {

			var it = this.items[p];
			if ( !it.hasTag ) {
				console.warn( this.items[p].id + ' Has no type. Removing.');
				delete this.items[p];
			} else if ( it.hasTag('home')) {
				it.need = this.homeTest;
			}

		}

	}

	homeTest( state, self, gs ) {

		var cur = gs.slots.home;
		return state.space.used <=
			state.space.max.delValue( self.mod.space.max.bonus - ( cur ? cur.mod.space.max.bonus : 0) );

	}

	initMaterials( mats ) {

		let byId = {};
		for( let i = mats.length-1; i>=0; i-- ) {
			byId[ mats[i].id] = mats[i];
		}

		this.matsById = byId;

	}

	revive() {

		if ( typeof this.restAction === 'string') this.restAction = this.getData( this.restAction );

		/**
		 * @compatibility
		 */
		if ( this.curHome ) this.slots['home'] = this.curHome;

		for( let p in this.slots ) {

			if ( typeof this.slots[p] === 'string') this.slots[p] = this.getData(this.slots[p] );
		}

		if ( this.quickslots ) {
			this.quickslots = this.quickslots.map( v=>this.getData(v) );
		}

		this.equip.revive( this );
		this.inventory.revive( this );

		this.player.revive(this);

		if ( this.curAction ) {

			if ( typeof this.curAction === 'string' ) this.curAction = this.getData( this.curAction );
			else if ( typeof this.curAction === 'object') {

				this.curAction = new Runnable( this.curAction );
				if ( typeof this.curAction.revive === 'function' ) this.curAction.revive(this);

			}

			if ( this.curAction.type === 'dungeon') {
				this.curAction = this.raid;
			}

		}

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
	 * @param {Object.<string,GData>} items
	 * @returns {Object.<string,GData[]>} lists
	 */
	makeLists( items ) {

		var lists = {};

		for( let p in items ) {

			var it = items[p];
			var tags = it.tags;
			if ( !tags ) continue;

			for( var t of tags ){

				//console.log('adding list: ' + t );
				var list = lists[t];
				if ( !list ) lists[t] = list = [];
				list.push( it );

			}

		}

		return lists;

	}

	/**
	 *
	 * @param {GData} it
	 * @param {number} slotNum
	 */
	setQuickSlot( it, slotNum ) {

		//console.log('use slot: ' + slotNum );
		// NOTE: using splice for Vue reactivity.
		if ( slotNum >= 0 && slotNum <=9 ) {

			let ind = slotNum > 0 ? slotNum - 1 : 9;
			if ( ind < this.quickslots.length ) this.quickslots.splice(ind,1, it );
			else {

				let a = this.quickslots.slice();
				a[ind] = it;
				this.quickslots = a;

			}

		}

	}

	/**
	 * Get quickslot item for slot number.
	 * @param {number} slotNum
	 * @returns {?GData}
	 */
	getQuickSlot( slotNum ) {
		let ind = slotNum > 0 ? slotNum - 1 : 9;
		return this.quickslots[ind];
	}

	/**
	 *
	 * @param {string} tag
	 * @returns {GData[]|undefined}
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
		let it = this.getData(id);
		if ( !it) return;

		it.max += amt;
	}

	fillItem( id ) {

		let it = this.getData(id);
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
	 * @returns {GData[]}
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

	/**
	 * Get item in named slot.
	 * @param {string} id - slot id.
	 * @param {string} type - item type for determining subslot (equip,home,etc)
	 */
	getSlot( id, type) {
		if ( type === 'wearable' || type === 'furniture') return null;
		return this.slots[id];
	}

	/**
	 * Set slotted item for exclusive items.
	 * @param {string} id
	 * @param {?GData} v - item to place in slot, or null.
	 */
	setSlot(id,v) {
		if ( v && (v.type === 'wearable' || v.type === 'furniture') ) return;
		this.slots[id] = v;
	}

	/**
	 * Find item in base items, equip, or inventory.
	 * @param {string} id
	 */
	findData(id) {

		return this.getData(id) || this.inventory.find(id) || this.equip.find(id);
	}

	getData(id) { return this.items[id];}

	getMaterial(id) { return this.matsById[id]; }

}