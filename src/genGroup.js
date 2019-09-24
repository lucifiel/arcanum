import {randElm} from './util/util';

/**
 * Category for items without an assigned value to a property
 * that should define their category.
 */
const DEFAULT_CATEGORY = 'any';

/**
 * Item generation group for a given item type.
 */
export default class GenGroup {

	/**
	 *
	 * @param {GData[]} items
	 */
	constructor( items ){

		this.items= items;
		this.filters = {};

	}

	/**
	 * Get a random item at or below the given level.
	 * @returns {GData}
	 */
	randBelow( level=1 ) {

		let levels = this.filters.level;

		let st = 1 + Math.floor( Math.random()*level );
		let i = st;

		do {

			var it = randElm( levels[i] );
			if ( it != null ) return it;

			if ( --i < 0 ) i = level;

		} while ( i != st );

		return it;

	}

	/**
	 * Get a random item without any restriction
	 * @returns {object}
	 */
	rand(){
		if ( this.items.length === 0) return null;
		return this.items[Math.floor(Math.random()*this.items.length)];
	}

	/**
	 * Get a random item from a filtered subcategory.
	 * @param {string} filter
	 * @param {string} sub
	 */
	filterRand( filter, sub ) {

		var o = this.filters[filter];
		if ( o===undefined) return null;

		o = filter[sub];
		if ( o===undefined || o.length === 0) return null;

		return o[ Math.floor( Math.random()*o.length) ];

	}

	/**
	 * Create a new named item category based on the 'prop' property
	 * of the items.
	 * @param {string} name - category name.
	 * @param {string} prop - prop to sort on. equal to name by default.
	 */
	makeFilter( name, prop='') {

		let filter = this.filters[name] = {};
		prop = prop || name;

		for( let i = this.items.length-1; i>= 0; i-- ) {

			var it = this.items[i];
			var cat = it[prop] || DEFAULT_CATEGORY;

			var list = filter[ cat ];
			if ( list === undefined ) {

				filter[ cat ] = [ it ];

			} else {
				list.push( it );
			}

		}

	}

}