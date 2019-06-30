import { defineExcept } from 'objecty';

/**
 * @typedef {Object} Effect
 * @property {?number} duration
 */

/**
 * Base class of game items.
 */
export default class Item {

	/**
	 * @property {string} type
	 */
	get type() { return this._type || 'item'; }
	set type(v) { this._type =v;}

	/**
	 * @property {string} id - internal id.
	 */
	get id() { return this._id; }
	set id(v) { this._id = v;}

	/**
	 * @property {string} name - displayed name.
	 */
	get name() { return this._name || this._id;}
	set name(v) { this._name = v;}

	/**
	 * @property {boolean} repeat
	 */

	/**
	 * @property {string} desc
	 */
	get desc() { return this._desc; }
	set desc(v) { this._desc=v;}

	/**
	 * @property {number} value
	 */
	get value() { return this._value; }
	set value(v) { this._value = v;}
	valueOf() { return this._value; }

	/**
	 * @property {boolean} removed - whether the item has been
	 * removed (permalocked) by another item.
	 */
	get removed() { return this._removed; }
	set removed(v) { this._removed = v;}

	/**
	 * @property {string|string[]} tag - tag to distinguish between
	 * item subtypes.
	 */
	get tags() { return this._tags;}
	set tags(v) {

		if ( typeof v === 'string') this._tags = v.split(',');
		else this._tags = v;

	}

	/**
	 * @property {number|Object.<string,number>} cost
	 */
	get cost() { return this._cost; }
	set cost(v) { this._cost=v;}

	get require() { return this._require; }
	set require(v) { this._require =v;}

	get effect() { return this._effect; }
	set effect(v) { this._effect=v;}

	/**
	 * @property {boolean} locked
	 */
	get locked() { return this._locked; }
	set locked(v) { this._locked = v; }

	/**
	 * @property {string|string[]} unlocks - items to force unlock.
	 * only use for simple unlocks. require on target for complex.
	 */
	get unlocks() { return this._unlocks;}
	set unlocks(v) { this._unlocks = v; }

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );
	
		if ( this._locked === undefined ) this._locked = true;

		defineExcept( this, null, ['require', 'must', 'buy', 'cost', 'name', 'effect', 'removed']);

	}

	applyEffect(e) {
	}

	/**
	 * 
	 * @param {Object} m - mod description. 
	 * @param {number} amt - factor of base amount added
	 * ( fractions of full amount due to tick time. )
	 */
	addMod( m, amt ) {

		if ( m instanceof Object ) {

			for( let p in m ) {

				if ( m[p] instanceof Object ) {
					console.log('subassign: ' + p)
					this.subassign( this[p], m[p], amt );
				} else if ( this.hasOwnProperty(p) ) {
					console.log('adding: ' + p );
					this[p] += Number(m[p])*amt;
				}

			}

			if ( m.base ) this.rate.base += m.base*amt;
			if ( m.pct ) this.rate.pct += m.pct*amt;
			if ( m.max ) {

				let vars = m.max;
				if ( !isNaN(vars) ) this.max += ( vars * amt );
				else if (vars instanceof Object ) {

					if ( vars.base ) this.max.base += vars.base*amt;
					if ( vars.pct ) this.max.pct += vars.pct*amt;
				}

			}

		}

	}

	/**
	 * Perform a subobject assignment.
	 * @param {Object} obj - base object being assigned to.
	 * @param {Object} m - object with subobjects representing assignment paths.
	 * @param {number} amt - amount multiplier for any assignments.
	 */
	subassign( obj, m, amt ) {

		if ( !obj instanceof Object ) {
			console.warn( 'invalid assign: ' + obj + ' = ' + m );
			return;
		}

		for( let p in m ) {
		
			console.log('assigning sub: ' + p + '=' + m[p]);

			if ( m[p] instanceof Object ) {
				subassign( obj[p], m[p], amt );
			} else {
				obj[p] += Number(m[p])*amt;
			}

		}

	}

	updateDot(e, dt) {
	}

	/**
	 * 
	 * @param {string} tag 
	 */
	addTag( tag ) {
		if ( !this._tags) this._tags = [];
		this._tags.push(tag);
	}

	/**
	 * 
	 * @param {string[]} a - array of tags to test.
	 * @returns {boolean}
	 */
	hasTags( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return false;

		return true;

	}

	/**
	 * Test if any tag in the list is matched.
	 * @param {string[]} a - array of tags to test.
	 * @returns {boolean}
	 */
	anyTag( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return true;

		return false;

	}

	/**
	 * 
	 * @param {string} t - tag to test.
	 * @returns {boolean}
	 */
	hasTag( t ) {
		return this._tags && this._tags.includes(t);
	}

}