import Slot from './slot';

export default class Equip {

	toJSON(){
		return { slots:( this.slots ) };
	}

	constructor( vars=null ) {

		if ( vars ) Object.assign(this, vars);

		this.slots = {
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
 
	get( slot ) {
		return this.slots[slot];
	}

	/**
	 * 
	 * @param {Item} it 
	 */
	remove( it, slot=null ) {

		if ( it.type === 'weapon') return this.removeWeap(it);

		slot = slot || it.slot;
		let cur = this.slots[it.slot];
		if ( cur ) return cur.remove(it);

		return false;

	}

	removeWeap( it ) {
		return this.slots.right.remove(it) || this.slots.left.remove(it);
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

			return rightItem || leftItem || [ rightItem, leftItem ];

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