import Slot from './slot';

export default class SlotGroup {

	get slots() { return this._slots; }
	set slots(v) {

		for( let p in v ) {

			var s = v[p];
			var it = s.item;
			if ( it !== null && it !== undefined ) {

				if ( Array.isArray(it) ) it = it;

				s.item = it;

			}

			if ( s instanceof Slot ) continue;
			v[p] = new Slot(s);

		}

		this._slots = v;

	}

	constructor( vars=null ) {

		if ( vars ) Object.assign(this, vars);

	}

	/**
	 * Find equipment item by id.
	 * @param {string} id 
	 * @returns {Item|null}
	 */
	find( id ) {

		for( let p in this.slots ) {
			var it = this.slots[p].find(id);
			if ( it ) return it;
		}
		return null;

	}

	/**
	 * Get item or items in a named slot.
	 * @param {string} slot 
	 * @returns {?Item|Item[]}
	 */
	get( slot ) {

		slot = this.slots[slot];
		if ( slot === undefined ) return undefined;

		return slot.item;


	}

	freeSpace( slot ) {
		slot = this.slots[slot];
		if ( slot === undefined ) return 0;
		return slot.freeSpace();
	}

	/**
	 * 
	 * @param {Item} it 
	 */
	remove( it, slot=null ) {

		slot = slot || it.slot;
		if ( typeof slot === 'string' ) slot = this.slots[slot];

		//console.log('remove from: ' + slot.id );
		if ( slot ) return slot.remove(it);

		return false;

	}

	revive(state) {
		for( let p in this.slots ) {
			this.slots[p].revive(state);
		}

	}

	/**
	 * 
	 * @param {Armor|Weapon} it 
	 * @param {string} slot 
	 * @returns {boolean|Wearable|Wearable[]}
	 */
	setSlot( it, slot=null ) {

		slot = slot || it.slot;
		if( slot === null || !this.slots.hasOwnProperty(slot)) return false;
		
		let cur = this.slots[slot];
		return cur.equip(it);
	}

	/**
	 * Iterate slot names.
	 */
	* slotNames() {
		for( let k in this.slots ) yield k;
	}

	* items() {

		for( let k in this.slots ) {
			var it = this.slots[k];
			if ( it ) yield it;
		}

	}

}