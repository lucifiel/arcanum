import Inventory from "./inventory";
import events, { DELETE_ITEM } from "../events";
import GData from "../items/gdata";

/**
 * List of GData items to attempt to use/cast.
 * Spelllists and pursuits, currently.
 */
export const ORDER = 'top';
export const RANDOM = 'rand';
export const LOOP = 'loop';

export default class DataList extends Inventory {

	toJSON(){

		let data = super.toJSON();
		if ( data.order !== LOOP ) data.order = this.order;
		data.lastInd = this.lastInd || undefined;

		return data;

	}

	/**
	 * @property {number} lastInd - index of last casted spell.
	 * only used for casting spells in loop order.
	 */
	get lastInd() { return this._lastInd; }
	set lastInd(v) { this._lastInd = v;}

	/**
	 * @property {number} order - ORDER,RANDOM,LOOP - cast attempt order.
	 */
	get order() { return this._order; }
	set order(v) { this._order=v;}

	constructor( vars=null ) {

		super(vars);

		this.lastInd = this.lastInd || 0;

		this.order = this.order || LOOP;

	}

	/**
	 * Get the next runnable data item, or null.
	 * @param {Game} g
	 * @returns {GData} Next runnable data, or null.
	 */
	getRunnable(g){

		var len = this.items.length;

		if ( len === 0) return null;

		let start = this.nextInd();
		let i = start;

		do {

			if ( this.items[i].canRun(g) ) return this.items[i];
			if ( ++i >= len ) i = 0;

		} while ( i !== start );

		return null;

	}

	/**
	 *
	 * @param {Game} g
	 * @returns {boolean}
	 */
	canRun(g) {

		for( let i = this.items.length-1; i>=0; i-- ) {
			if ( this.items[i].canRun(g) ) return true;
		}

		return false;

	}

	/**
	 * usable if at least one spell can be cast.
	 * @param {Game} g
	 * @returns {boolean}
	 */
	canUse( g ) {

		for( let i = this.items.length-1; i>=0; i-- ) {
			if ( this.items[i].canUse(g) ) return true;
		}

		return false;

	}

	/**
	 * Get next usable item and return it.
	 * Use index is advanced.
	 * @param {*} g
	 * @returns {?GData}
	 */
	nextUsable(g){

		var len = this.items.length;

		let start = this.nextInd();
		let i = start;

		do {

			var it = this.items[i];

			if ( it.canUse(g) ) {

				if ( it.cost ) g.payCost(it.cost);
				this.lastInd = i;
				return it;

			}
			if ( ++i >= len ) i = 0;

		} while ( i !== start );

		return null;

	}

	/**
	 *
	 * @param {Game} g
	 * @returns {boolean} true if spell was successfully cast.
	 */
	onUse(g) {

		var it = this.nextUsable(g);
		if ( it ) {
			it.onUse(g);
			return true;
		}
		return false;

	}

	/**
	 * @returns {number} - index of next spell to cast.
	 */
	nextInd(){

		if ( this.order === ORDER ) {
			return 0;

		} else if ( this.order === LOOP ) {

			return this.lastInd < this.items.length-1 ? this.lastInd+1 : 0;

		} else if ( this.order === RANDOM ) {
			return Math.floor( Math.random()*this.items.length );
		}
		return 0;

	}

	dataDeleted(it) {
		this.remove(it);
	}

	/**
	 *
	 * @param {GameState} gs
	 */
	revive(gs){

		super.revive(gs);

		events.add( DELETE_ITEM, this.dataDeleted, this );

	}

}