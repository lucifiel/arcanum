import { defineExcept, clone } from 'objecty';
import Stat from '../stat';
import Base, {mergeClass} from './base';

/**
 * @typedef {Object} Effect
 * @property {?number} duration
 */

/**
 * Game Data base class.
 */
export default class GData {

	/**
	 * @property {boolean} disabled - whether the item has been
	 * disabled / is no longer available.
	 */
	get disabled() { return this._disabled; }
	set disabled(v) { this._disabled = v;}

	/**
	 * @property {Stat} max
	 */
	get max() { return this._max; }
	set max(v) {
		if ( this._max ) {

			if ( v instanceof Stat ) this._max = v;
			else if ( !isNaN(v) ) this._max.base = v;

		} this._max = v instanceof Stat ? v : new Stat(v);
	}

	/**
	 * @property {Stat} rate - rate of stat change in value/second.
	 */
	get rate() { return this._rate; }
	set rate(v){

		if ( this._rate ) {

			if ( typeof v === 'object' ) Object.assign( this._rate, v);
			else this._rate.base = v;

		} else this._rate = ( v instanceof Stat ) ? v : new Stat(v);

	}

	/**
	 * @property {number|Object.<string,number>} cost
	 */
	get cost() { return this._cost; }
	set cost(v) { this._cost=v;}

	/**
	 * @property {string|Object}
	 */
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

	get owned() { return this._owned;}
	set owned(v) { this._owned = v; }

	/**
	 *
	 * @param {?Object} [vars=null]
	 */
	constructor( vars=null, defaults=null ){

		if ( vars ) Object.assign( this, vars );
		if ( defaults ) this.setDefaults( defaults );

		if ( this._locked === undefined || this._locked === null ) this.locked = true;

		this._value = this._value || 0;

		//if ( this.owned) console.log('owned: ' + this.owned + ' id: ' + this.id);

		//if ( this.slot ) console.log( this.id + ' slot: ' + this.slot );
		defineExcept( this, null,
			['require', 'rate', 'need', 'value', 'buy', 'max', 'cost', 'id', 'name', 'warn', 'effect', 'slot' ]);

	}

	setDefaults( defaults ) {

		var obj;

		for( let p in defaults ) {

			var cur = this[p];
			if ( cur === undefined || cur === null ) {

				obj = defaults[p];
				if ( typeof obj === 'function' ) this[p] = obj( this );
				else if ( typeof obj === 'object' ) this[p] = clone( obj );
				else this[p] = obj;

			}

		}

	}

	/**
	 * @returns {boolean} true if an unlocked item is at maximum value.
	 */
	maxed() {

		return this.max ? (this.value >= Math.floor(this.max.value) ) :
			( this.repeat !== true &&
				this._value > 0 &&
				(!this.buy || this.owned===true) );

	}

	/**
	 * Perform cost scaling based on current value.
	 * @param {*} s
	 */
	scaleCost( s ) {

		let cost = this.cost;
		if (!cost) return;

		let type = typeof cost;
		if ( type === 'string') return;
		else if ( !isNaN(type)) {

		}

	}

	/**
	 * Add a requirement to unlock this item.
	 * @param {string} reqStr
	 * @param {number} amt
	 * @param {'require'|'need'} type - requirement to set.
	 */
	addRequire( reqStr, amt, type='require' ){

		let cur = this[type];
		if ( !cur) {
			this[type] = {[reqStr]:amt};
		} else if ( Array.isArray(cur) ) {

			cur.push( { [reqStr]:amt} );

		} else if ( typeof cur === 'object' ) {

			cur[reqStr] = amt;

		} else if ( typeof cur === 'function') {
			console.log('adding requirement');
			this[type] = [ cur, {[reqStr]:amt} ];
		}

	}

}

mergeClass( GData, Base );