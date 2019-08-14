import { defineExcept } from 'objecty';
import Stat from '../stat';
import Base, {mergeClass} from './base';

/**
 * @typedef {Object} Effect
 * @property {?number} duration
 */

/**
 * Game Items base class.
 */
export default class Item {

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

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );

		if ( this._locked === undefined ) this._locked = true;

		this._value = this._value || 0;

		defineExcept( this, null,
			['require', 'rate', 'need', 'value', 'buy', 'max', 'cost', 'id', 'name', 'warn', 'effect', 'slot' ]);

	}

	/**
	 * @returns {boolean} true if an unlocked item is at maximum value.
	 */
	maxed() {
		
		return this.max ? this._value >= this.max :
			!this.repeat && this._value > 0;

	}

}

mergeClass( Item, Base );