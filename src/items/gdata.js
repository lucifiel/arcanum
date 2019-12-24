import { defineExcept, clone } from 'objecty';
import Stat from '../values/stat';
import Base, {mergeClass, initMods} from './base';
import {arrayMerge} from '../util/array';
import { assignPublic } from '../util/util';
import Events, { ITEM_ATTACK, EVT_EVENT, EVT_UNLOCK } from '../events';
import { TICK_LEN } from '../game';
import { WEARABLE, WEAPON } from '../values/consts';
import RValue from '../values/rvalue';

/**
 * @typedef {Object} Effect
 * @property {?number} duration
 */

 const NoDefine = new Set(['require', 'rate', 'current', 'need', 'value', 'buy',
	 'max', 'cost', 'id', 'name', 'warn', 'effect', 'slot' ]);

/**
 * @const {Set} NoDefine - properties not to set to default values.
 */
const NoDefine = new Set( ['require', 'rate', 'current', 'need', 'value', 'buy', 'max',
	'cost', 'id', 'name', 'warn', 'effect', 'slot', 'exp' ] )

/**
 * Game Data base class.
 */
export default class GData {

	/**
	 * @property {string} module - source module.
	 */
	get module(){return this._module;}
	set module(v){this._module =v;}

	/**
	 * @property {boolean} disabled - whether the item has been
	 * disabled / is no longer available.
	 */
	get disabled() { return this._disabled; }
	set disabled(v) { this._disabled = v;}

	/**
	 * @property {string} sym - optional unicode symbol.
	 */
	get sym() { return this._sym; }
	set sym(v) { this._sym=v;}

	/**
	 * @property {Stat} max
	 */
	get max() { return this._max; }
	set max(v) {

		if ( v === null || v === undefined ) return;

		if ( this._max ) {

			if ( v instanceof Stat ) this._max.base = v.base;
			else if ( !isNaN(v) ) this._max.base = v;

		} else this._max = v instanceof Stat ? v : new Stat(v, this.id + '.max', true);
	}

	/**
	 * @property {Stat} rate - rate of stat change in value/second.
	 */
	get rate() { return this._rate; }
	set rate(v){

		if ( v instanceof Stat ) {

			v.id = this.id + '.rate';
			this._rate = v;

		} else if ( this._rate ) {

			if ( typeof v === 'object' ) Object.assign( this._rate, v);
			else this._rate.base = v;

		} else this._rate = new Stat( v, this.id + '.rate' );

	}

	/**
	 * @property {.<string,number>} cost
	 */
	get cost() { return this._cost; }
	set cost(v) {

		if ( typeof v !== 'object' || v instanceof RValue ) {
			this._cost = {
				gold:v
			}
		} else this._cost=v;
	}

	/**
	 * @property {string|Object}
	 */
	get require() { return this._require; }
	set require(v) { this._require =v;}

	get warn() { return this._warn; }
	set warn(v) { this._warn =v;}

	get warnMsg(){return this._warnMsg; }
	set warnMsg(v) { this._warnMsg = v; }

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
	 * @property {Stat} value
	 */
	get value() { return this._value; }
	set value(v) {

		if ( v instanceof Stat ) {

			if ( this._value === null || this._value === undefined ) this._value = v;
			else if ( v !== this._value ) {

				this._value.base = v.base;
				this._value.basePct = v.basePct;

			}

		} else if ( this._value !== undefined ) {


			this._value.base = (typeof v === 'object') ? v.value : v;

		} else this._value = new Stat( v, this.id );

	}

	get val() { return this.value; }
	set val(v) { this.value = v; }

	valueOf(){ return this._value.valueOf(); }

	/**
	 * Set owner property of all RValue subs to this.
	 */
	initRVals(obj=this){

		for( let p in obj ) {

			var s = this[p];
			if ( !s ) continue;
			if ( Array.isArray(s) ) {

				for( let i = s.length-1; i>= 0; i-- ) {
					if ( typeof s === 'object') this.initRVals(s);
				}

			} else if ( typeof s === 'object') {

				if ( s.isRVal ) s.owner = this;
				else this.initRVals( s );

			}

		}

	}

	/**
	 *
	 * @param {?Object} [vars=null]
	 */
	constructor( vars=null, defaults=null ){

		this.initRVals();

		if ( vars ) {

			if ( typeof vars === 'object'){
				if ( vars.id ) this.id = vars.id;	// used to assign sub-ids.
				assignPublic( this, vars );
			}
			else if ( !isNaN(vars) ) this.val = vars;
		}
		if ( defaults ) this.setDefaults( defaults );

		if ( this._locked === undefined || this._locked === null ) this.locked = true;

		/**
		 * recomputed at game start.
		 */
		this.locks = 0;

		if ( this._value === null || this._value === undefined ) this.val = 0;

		defineExcept( this, null, NoDefine );

		if ( this.mod ) {
			initMods( this.mod, this.value );
		}

	}

	/**
	 * Determines whether an item can be run as a continuous action.
	 * @param {Game} g
	 * @param {number} dt - minimum length of time item would run.
	 * @returns {boolean}
	 */
	canRun( g, dt=TICK_LEN ) {

		if ( this.disabled || this.maxed() || (this.need && !g.unlockTest( this.need, this )) ) return false;

		if ( this.buy && !this.owned && !g.canPay(this.buy ) ) return false;

		// cost only paid at _start_ of runnable action.
		if ( this.cost && (this.exp == 0) && !g.canPay(this.cost ) ) return false;

		if ( this.fill && g.filled( this.fill, this ) ) return false;

		return !this.run || g.canPay( this.run, dt );

	}

	/**
	 * Determine if this resource can pay the given amount of value.
	 * Made a function for reverseStats, among other things.
	 * @param {number} amt
	 */
	canPay( amt ) { return this.value >= amt; }
	remove( amt ) { this.value.base -= amt; }

	/**
	 * Test whether item succeeds when tested as a game requirement.
	 * @returns {boolean}
	 */
	test(){
		/**
		 * @todo must be unlocked as well?
		 */
		return this.value > 0;
	}

	/**
	 * Determine if an item can be used. Ongoing/perpetual actions
	 * test with 'canRun' instead.
	 * @param {Game} g
	 */
	canUse( g ){

		if ( this.disabled || this.locks>0||
				(this.need && !g.unlockTest( this.need, this )) ) return false;
		if ( this.buy && !this.owned && !g.canPay(this.buy) ) return false;

		if ( this.perpetual || this.length>0 ) { return this.canRun(g); }

		if ( this.slot && g.state.getSlot(this.slot, this.type ) === this) return false;
		if ( this.maxed() ) return false;

		if ( this.fill && g.filled( this.fill, this ) ) return false;

		return !this.cost || g.canPay(this.cost);
	}

	canBuy(g){

		if ( this.disabled || this.locked || this.locks > 0 ) return false;

		if ( this.buy && !g.canPay(this.buy) ) return false;

		return this.maxed() === false;

	}

	/**
	 * Add or remove amount from Item, after min/max bounds are taken into account.
	 * @param {number} amt
	 * @returns {number} - change in final value.
	 */
	add( amt ) {

		let prev = this.value.valueOf();

		if ( amt <= 0 ) {

			if ( prev <= 0 || amt === 0 ) return 0;
			else if ( prev + amt <= 0 ) {
				/** @todo **/
				this.value.base = 0;
				return -prev;
			}

		} else {

			if ( this.repeat !== true && !this.max &&
				this.value > 1 &&
				(!this.buy || this.owned===true) ) {
				return 0;
			}

			if ( this.max && (prev + amt) >= this.max.value ) {
				amt = this.max.value - prev;
			}

		}

		this.value.base += amt;
		return this.value.valueOf() - prev;

	}

	/**
	 * Get or lose quantity.
	 * @param {Game} g
	 * @returns {boolean} true if some amount was actually added.
	 */
	amount( g, count=1 ) {

		count = this.add(count);
		if ( count === 0 ) return false;

		this.change( g, count );
		return true;

	}

	/**
	 * Process an actual change amount in data. This is after Stat Mods
	 * have been applied to the base value.
	 * @param {number} count - total change in value.
	 */
	change( g, count) {

		if ( this.isRecipe ) { return g.create( this, true, count ); }

		if ( this.once && this.valueOf() === 1 ) g.applyVars( this.once );

		if ( this.cd ) g.addTimer( this );
		if ( this.loot ) g.getLoot( this.loot );

		if ( this.title ) g.state.player.setTitle( this.title );
		if ( this.result ) g.applyVars( this.result, count );
		if ( this.create ) g.create( this.create );
		if ( this.mod ) { g.applyMods( this.mod ); }

		if ( this.lock ) g.lock( this.lock );
		if ( this.dot ) {
			g.state.player.addDot( this.dot, this.id );
		}

		if ( this.disable ) g.disable( this.disable );

		if ( this.log ) Events.emit( EVT_EVENT, this.log );

		if ( this.attack ) {
			if (this.type !== WEARABLE && this.type !== WEAPON ) Events.emit( ITEM_ATTACK, this );
		}
		this.dirty = true;

	}

	lock(amt){
		this.locks += amt;
		this.dirty = true;
	}

	doUnlock(){

		if ( this.disabled || this.locked === false || this.locks>0 ) return;

		this.locked = false;
		Events.emit( EVT_UNLOCK, this );
		this.dirty = true;
	}

	/**
	 * Default implementation of onUse() is to add 1.
	 * @param {Game} g
	 */
	onUse( g ) {

		if ( this.slot ) g.setSlot( this );
		else this.amount( g, 1 );

	}

	/**
	 * Determine whether the item is filled relative to a filling rate.
	 * if the filling rate + natural item rate can't fill the item
	 * it is considered filled to avoid getting stuck.
	 * @param {number} rate
	 */
	filled( rate=0 ) {
		return (this.max && this.value >= this.max.value) ||
		(this.rate && (this.rate + rate.valueOf() ) <= 0); }

	/**
	 * @returns {boolean} true if an unlocked item is at maximum value.
	*/
	maxed() {

		if ( this.max ) return this.value >= Math.floor( this.max.value);

		return !(this.repeat||this.owned) && this.value > 0;

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
	 * shorthand for locked||disabled||locks>0
	 */
	blocked() {
		return this.locked || this.disabled || this.locks>0;
	}

	/**
	 * Perform cost scaling based on current value.
	 * @todo @unused
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
	 * Add a requirement for unlocking this data.
	 * @param {string|string[]} item
	 */
	addRequire( item ) {

		if ( !this.require ) {

			this.require = item;

		} else if ( this.require === item ||
				(Array.isArray(this.require) && this.require.includes(item)) ) {
					return;
		} else {
			this.require = arrayMerge( this.require, item );
		}

	}

}

mergeClass( GData, Base );