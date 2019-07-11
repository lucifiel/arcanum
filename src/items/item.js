import { defineExcept } from 'objecty';
import Stat from '../stat';
import Game from '../game';

/**
 * @typedef {Object} Effect
 * @property {?number} duration
 */

/**
 * Game Items base class.
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
	toString(){return this.id;}

	/**
	 * @property {string} name - displayed name.
	 */
	get name() { return this._name || this.id;}
	set name(v) { this._name = v;}

	/**
	 * @property {boolean} repeat - whether the item is repeatable.
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
	 * @property {boolean} disabled - whether the item has been
	 * disabled / is no longer available.
	 */
	get disabled() { return this._disabled; }
	set disabled(v) { this._disabled = v;}

	/**
	 * @property {string|string[]} tag - tag to distinguish between
	 * item subtypes.
	 */
	get tags() { return this._tags;}
	set tags(v) {

		if ( typeof v === 'string') this._tags = v.split(',');
		else this._tags = v;

	}
	set tag(v) { this.addTag(v); }

	get progress() { return this._exp || 0; }
	set progress(v){
		this._exp = v;
		if ( v >= this._length) {

			this.value++;
			if ( this.result ) Game.applyEffect( this.result );

		}

	}

	get length() { return this._length; }
	set length(v) {
		this._length = v;
	}

	/**
	 * @property {Stat} rate - rate of stat change in value/second.
	 */
	get rate() { return this._rate; }
	set rate(v){ this._rate = ( v instanceof Stat ) ? v : new Stat(v); }

	/**
	 * @property {number|Object.<string,number>} cost
	 */
	get cost() { return this._cost; }
	set cost(v) { this._cost=v;}

	get require() { return this._require; }
	set require(v) { this._require =v;}

	/**
	 * @property {Object|Array|string|function} effect
	 */
	get effect() { return this._effect; }
	set effect(v) { this._effect=v;}

	/**
	 * @property {number} locks - number of locks preventing item from
	 * being used or unlocked.
	 */
	get locks() { return this._locks||0;}
	set locks(v) { this._locks = v;}

	/**
	 * @property {boolean} locked
	 */
	get locked() { return this._locked; }
	set locked(v) { this._locked = v; }

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );
	
		if ( this._locked === undefined ) this._locked = 1;

		if ( this._length !== undefined ) this._exp = this._exp || 0;

		this._value = this._value || 0;
		defineExcept( this, null,
			['require', 'rate', 'need', 'buy', 'max', 'cost', 'name', 'effect', 'slot', 'length' ]);

	}

	/**
	 * @returns {boolean} true if an unlocked item is at maximum value.
	 */
	maxed() {
		
		return this.max != null ? this._value >= this.max :
			!this.repeat && this._value > 0;

	}

	/**
	 * 
	 * @param {Object} m - effect/mod description. 
	 * @param {number} pct - factor of base amount added
	 * ( fractions of full amount due to tick time. )
	 */
	applyVars( m, pct=1 ) {

		if (!isNaN(m)) this.value += m;
		else if ( m instanceof Object ) {

			if ( m.max ) {

				let vars = m.max;
				if ( !isNaN(vars) ) this.max += ( vars * pct );
				else if (vars instanceof Object ) {

					if ( vars.base ) this.max.base += vars.base*pct;
					if ( vars.pct ) this.max.pct += vars.pct*pct;
				}
				if ( this.value > this.max.value ) this.value = this.max.value;

			}

			for( let p in m ) {

				if ( p === 'base' || p === 'pct' || p === 'max') continue;

				if ( m[p] instanceof Object ) {
					console.log('subassign: ' + p)
					this.subassign( this[p], m[p], pct );
				} else if ( this[p] !== undefined ) {
					//console.log('adding: ' + p );
					this[p] += Number(m[p])*pct;
				}

			}

			if ( m.base ) this.rate.base += m.base*pct;
			if ( m.pct ) this.rate.pct += m.pct*pct;

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