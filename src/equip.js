import Slot from './slot';

export default class Equip {

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

		if ( !this.slots.hasOwnProperty(slot)) return null;
		return this.slots[slot];

	}

	getWeapons() {

		let right = this.slots.right;
		let left = this.slots.left;

		if ( right === null ) return left ? ( left.type === 'weapon' ? left : null ) : null;
		else if ( left === null ) return right.type === 'weapon' ? right : null;

		if ( right.type !== 'weapon') return left.type === 'weapon' ? left : null;
		if ( left.type !== 'weapon') return right.type === 'weapon' ? right : null;

		return [left,right];

	}

	/**
	 * 
	 * @param {Item} it 
	 */
	remove( it ) {

		if ( it.type === 'weapon') return this.removeWeap(it);

		let cur = this.slots[it.slot];
		if ( cur ) return this.slots.remove(it);

		return false;

	}

	/**
	 * Remove and return the item in the specified slot.
	 * @param {string} slot 
	 */
	removeSlot( slot ) {

		if ( typeof slot === 'string' ) slot = this.slots[slot];
		if( !slot ) return undefined;

		return slot.remove();

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
	 * @param {string} slot 
	 * @param {Armor|Weapon} it 
	 * @returns error string if slot does not exist, null if equip
	 * successful, old item if item replaces previous.
	 */
	equip( it ) {

		if ( it.type === 'weapon' ) return this.equipWeap(it);

		let slot = it.slot;
		if( slot === null || !this.slots.hasOwnProperty(slot)) return it.name + ' cannot be equipped.';

		let cur = this.slots[slot];
		if ( cur instanceof Array ) {

			cur.push( it );
			if ( cur.length > MaxSlots[slot] ) cur = cur.shift();
			else cur = null;

		} else {

			if ( !cur ) {
				this.slots[slot] = it;
			} else {

				if ( MaxSlots[slot] == null || MaxSlots[slot] === 1 ) {
					this.slots[slot] = it;
				} else {
					this.slots[slot] = [ cur, it ];
					cur = null;	// cur not replaced.
				}

			}

		}

		return cur;

	}

	/**
	 * 
	 * @param {(it)=>boolean} p - test predicate
	 */
	removeWhere( p ) {

		let v;
		let removed = [];

		for( let k in this.slots ) {

			v = this.slots[k];
			if ( v === null || v === undefined ) continue;

			if ( v instanceof Array ) {

				for( let i = v.length-1; i >= 0; i-- ) {

					if ( p( v[i]) ) {
						removed.push( v.splice(i,1)[0] );
					}

				}

			} else if ( p(v) ) {

				this.slots[k] = null;
				removed.push(v);

			}

		}

		return removed;

	}

	forEach( func ) {

		let v;

		for( let k in this.slots ) {

			v = this.slots[k];
			if ( v instanceof Array ) {

				for( let i = v.length-1; i >= 0; i-- ) func( v[i] );

			} else func( v );

		}

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