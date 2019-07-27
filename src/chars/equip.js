import Slot from './slot';

export default class Equip {

	toJSON(){
		return { slots:( this.slots ) };
	}

	constructor( vars=null ) {

		if ( vars ) Object.assign(this, vars);

		this.slots = {
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
			}),
			"left":new Slot({
				id:'left'
			}),
			"right":new Slot({
				id:'right'
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
		if ( cur ) return this.slots.remove(it);

		return false;

	}

	removeWeap( it ) {
		return this.slots.right.remove(it) || this.slots.left.remove(it);
	}

	equipWeap( it ) {

		console.log('equipping weapon...');

		let right = this.slots.right;
		let left = this.slots.left;

		if ( it.hands === 2 ) {

			console.log( 'Setting two handed weapon.');
			this.slots.right = it;
			this.slots.left = null;

			if ( right === null ) return left;
			if ( left === null ) return right;
			return [ left, right ];

		} else {

			if ( right === null ) {

				console.log('setting right hand.');

				this.slots.right = it;
				if ( left !== null && left.hands === 2 ) {
					this.slots.left = null;
					return left;
				}

			} else if ( left === null ) {

				console.log('setting left hand.');

				this.slots.left = it;
				if ( right !== null && right.hands === 2 ) {
					this.slots.right = null;
					return right;
				}

			} else {

				console.log('passing off hands.');

				// can't both be two-handed.
				this.slots.right = it;
				this.slots.left = right;

				return left;

			}
			return null;

		}

	}

	/**
	 * 
	 * @param {Armor|Weapon} it 
	 * @param {string} slot 
	 * @returns {boolean|Wearable}
	 */
	equip( it, slot=null ) {

		if ( it.type === 'weapon' ) return this.equipWeap(it);

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