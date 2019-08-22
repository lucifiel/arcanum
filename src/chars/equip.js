import Slot from './slot';
import Wearable from './wearable';
import SlotGroup from './slotgroup';

export default class Equip extends SlotGroup {

	toJSON(){
		return { slots:( this.slots ) };
	}

	get slots() { return this._slots; }
	set slots(v) {

		for( let p in v ) {

			var s = v[p];
			var it = s.item;
			if ( it !== null && it !== undefined ) {

				if ( Array.isArray(it) ) it = it.map( k=>new Wearable(k) );
				else it = new Wearable(it);

				s.item = it;

			}

			if ( s instanceof Slot ) continue;
			v[p] = new Slot(s);

		}

		this._slots = v;

	}

	constructor( vars=null ) {

		super(vars );

		this.slots = this._slots || {
			"left":new Slot({
				id:'left'
			}),
			"right":new Slot({
				id:'right'
			}),
			"head":new Slot({
				id:'head'
			}),
			"hands":new Slot({
				id:'hands'
			}),
			"back":new Slot({
				id:'back'
			}),
			"waist":new Slot({
				id:'waist'
			}),
			"neck":new Slot({
				id:'neck',
				max:3
			}),
			"fingers":new Slot({
				id:'fingers',
				max:4
			}),
			"chest":new Slot({
				id:'chest'
			}),
			"shins":new Slot({
				id:'shins'
			}),
			"feet":new Slot({
				id:'feet'
			})
		};

	}

	/**
	 * 
	 * @param {Item} it 
	 */
	remove( it, slot=null ) {
		return ( it.type === 'weapon') ? this.removeWeap(it) : super.remove(it,slot);
	}

	removeWeap( it ) {
		return this.slots.right.remove(it) || this.slots.left.remove(it);
	}

	/**
	 * Get a count of items returned when using item.
	 * This is to ensure there is sufficient inventory space for new items.
	 * (Equip from Dungeon drops, multihanded weaps, etc.)
	 * @todo this is somewhat incorrect as inventory doesnt currently count spaces-used.
	 * @param {Item} it
	 * @returns {number}
	 */
	replaceCount(it) {

		let space = (it.kind==='weapon') ?
			this.freeSpace( 'right' ) + this.freeSpace('left') : this.freeSpace(it.slot);
	
		return Math.max( ( it.numslots || 1 ) - space, 0 );

	}

	/**
	 * 
	 * @param {Armor|Weapon} it 
	 * @param {string} slot 
	 * @returns {boolean|Wearable|Wearable[]}
	 */
	equip( it, slot=null ) {

		if ( it.kind === 'weapon' ) return this.equipWeap(it);

		slot = slot || it.slot;
		if( slot === null || !this.slots.hasOwnProperty(slot)) return false;
		
		let cur = this.slots[slot];
		return cur.equip(it);
	}

	/**
	 * 
	 * @param {*} it
	 * @returns {Item|Item[]|true} 
	 */
	equipWeap( it ) {

		console.log('equipping weapon...');

		let right = this.slots.right;
		let left = this.slots.left;

		if ( it.hands === 2 ) {

			console.log( 'Setting two handed weapon.');
			let rightItem = right.equip( it );
			let leftItem = left.remove();

			return rightItem && leftItem ? [ rightItem, leftItem ] :
				(rightItem || leftItem );

		} else {

			if ( right.empty() ) {

				console.log('setting right hand.');

				right.equip( it );
				return ( left.hands() > 1 ) ? left.remove() : true;

			} else if ( left.empty() ) {

				console.log('setting left hand.');

				left.equip( it );
				return ( right.hands() > 1 ) ? right.remove() : true;

			} else {

				console.log('neither empty. passing off hands.');

				let res = right.equip( left.equip(it) );
				return res;

			}

		}

	}

}