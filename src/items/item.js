import { defineExcept, changes, jsonify } from 'objecty';
import Stat from '../stat';

import Game from '../game';

/**
 * @typedef {Object} Effect
 * @property {?number} duration
 */

 // TODO: restore 'tags' later if tags become dynamic.

 /**
  * @const {string[]} JSONIgnore - ignore these properties by default when saving.
  */
 const EncodeIgnore = [ 'template', 'id', 'type', 'name', 'desc', 'locked', 'delta', 'tags'];

/**
 * Game Items base class.
 */
export default class Item {

	/**
	 * @property {Object} template - data used to create this Item.
	 */
	get template() { return this._template; }
	set template(v) { this._template = v;}

	/**
	 * Get JSON for a sub-class with additional properties excluded.
	 * @param {string[]} excludes 
	 */
	subJSON( excludes ) {

		let vars = changes( jsonify(this, EncodeIgnore.concat(excludes) ),
			this.template || {} );

		if ( this.locked === false && this.template.locked !== false ){
			vars = vars || {};
			vars.locked = this.locked;
		}

		return vars != null ? vars : undefined;

	}

	toJSON() {

		let vars = changes( jsonify(this, EncodeIgnore ),
			this.template || {} );


		if ( this.locked === false && this.template.locked !== false ){
			vars = vars || {};
			vars.locked = this.locked;
		}

		//if ( this.disabled === true ) vars.disabled = true;
		//if ( this.locks ) vars.locks = this.locks;
		//if ( this.template.value != this.value ) vars.value = this.value;

		return vars != null ? vars : undefined;

	}


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

	/**
	 * @property {Stat} max
	 */
	get max() { return this._max; }
	set max(v) { this._max = v instanceof Stat ? v : new Stat(v); }

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
			['require', 'rate', 'need', 'buy', 'max', 'cost', 'name', 'warn', 'effect', 'slot' ]);

	}

	/**
	 * @returns {boolean} true if an unlocked item is at maximum value.
	 */
	maxed() {
		
		return this.max ? this._value >= this.max :
			!this.repeat && this._value > 0;

	}

	/**
	 * 
	 * @param {Object} m - effect/mod description. 
	 * @param {number} amt - factor of base amount added
	 * ( fractions of full amount due to tick time. )
	 */
	applyVars( m, amt=1 ) {

		if (!isNaN(m)) this.value += m;
		else if ( typeof m === 'object' ) {

			if ( m.max ) {

				let vars = m.max;
				if ( !isNaN(vars) ) this.max += ( vars * amt );
				else if ( typeof vars === 'object' ) {

					if ( vars.base ) this.max.base += vars.base*amt;
					if ( vars.pct ) this.max.pct += vars.pct*amt;
				}
				if ( this.value > this.max.value ) this.value = this.max.value;

			}
			if ( m.mod ) this.changeMod( m.mod, amt );

			for( let p in m ) {

				if ( p === 'rate' || p === 'pct' || p === 'max' || p === 'skipLocked') continue;

				if ( m[p] instanceof Object ) {
					console.log('subassign: ' + p)
					this.subassign( this[p], m[p], amt );
				} else if ( this[p] !== undefined ) {
					//console.log('adding: ' + p );
					this[p] += Number(m[p])*amt;
				} else {
					console.log('NEW SUB: ' + p );
				}

			}

			if ( m.rate ) this.rate.base += m.rate*amt;
			if ( m.pct ) this.rate.pct += m.pct*amt;

		}

	}

	/**
	 * Change a modifier controlled by this Item.
	 * @param {Object} mod
	 * @param {number} amt - percent of change applied to modifier.
	 */
	changeMod( mod, amt ) {

		// apply change to modifier for existing item amount.
		Game.addMod( mod, amt*this.value );

	}

	/**
	 * Perform a subobject assignment.
	 * @param {Object} obj - base object being assigned to.
	 * @param {Object} m - object with subobjects representing assignment paths.
	 * @param {number} amt - amount multiplier for any assignments.
	 */
	subassign( obj, m, amt ) {

		if ( !typeof obj === 'object' ) {
			console.warn( 'invalid assign: ' + obj + ' = ' + m );
			return;
		}

		for( let p in m ) {
		
			console.log('assigning sub: ' + p + '=' + m[p]);

			if ( typeof m[p] === 'object' ) {
				this.subassign( obj[p], m[p], amt );
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
		if ( this._tags === null || this._tags === undefined) this._tags = [ tag ];
		else if ( !this._tags.includes(tag) ) this._tags.push(tag);
	}

	/**
	 * Test if item has every tag in list.
	 * @param {string[]} a - array of tags to test.
	 * @returns {boolean}
	 */
	hasTags( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return false;

		return true;

	}

	/**
	 * Test if tag has any tag in the list.
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
	hasTag( t ) { return this._tags && this._tags.includes(t); }

}