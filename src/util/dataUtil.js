import { clone } from "objecty";
import Stat from "../values/stat";

/**
 * Find and return first element of set matching predicate.
 * @param {Iterator} s
 * @param {*=>boolean} p
 * @returns {*} matched element, or null.
 */
export const iterableFind = (s,p)=>{

	for( let t of s ) if ( p(t) ) return t;
	return null;

}

/**
 * Map elements of iterator to an array.
 * @param {Iterator} it
 * @param {*=>*} p
 * @returns {Array}
 */
export const iterableMap = (it,p)=>{

	let a = [];
	for( let t of it ) {
		a.push( p(t) );
	}

	return a;
}

/**
 * Clear set and add all items from an iterable.
 * @param {Set} s
 * @param {Iteratable} items
 */
export const setReplace = (s,items)=>{

	s.clear();
	for( let it of items ) s.add(it);

}

/**
 * Map the elements of a set to new values.
 * Creates a new Set to match Array function.
 * @param {Set.<*>} s
 * @param {(*)=>*} p - mapping function.
 * @returns {Set.<*>}
 */
export const mapSet = (s, p) => {

	let a = [];
	for( let t of s ) {
		a.push( p(t) );
	}

	return new Set( a );

}

/**
 * Utilities specific to merging game data.
 */

/**
 * Use total values as mod values in cumulative stats?
 * Any stat can be used as a component in another aggregate stat?
 */

/**
 * Convert object entries to Stat-values.
 * @param {object} obj
 * @returns {object} the object.
 */
export const toStats = (obj) => {

	for( let p in obj ) {
		var s = obj[p];
		obj[p] = s instanceof Stat ? s : new Stat( s, p);
		//console.log('NEW STAT: ' + p + ': ' + s.valueOf() );
	}
	return obj;

}

/**
 * Create a new cost object with requirements from both.
 * @todo this won't keep pace with modified costs.
 * @param {*} c1
 * @param {*} c2
*/
export const mergeCosts = ( c1, c2 ) => {

	if ( !c1 ) return clone(c2);
	if ( !c2 ) return clone(c1);

	let res = {};

	if ( typeof c1 === 'string') {
		res[c1] = 1;
	} else if ( typeof c1 === 'object') {
		clone(c1, res);
	}

	addValues( res, c2 );

	return res;

}

/**
 * Write numeric values into a destination object.
 * If the destination target for a keyed number is an object,
 * the keyed number is added to the object's 'value' property.
 * @param {object} obj
 * @param {*} vals
 */
export const addValues = (obj, vals) => {

	if ( typeof vals === 'string') {

		let cur = obj[vals];
		if ( !cur) obj[vals] = 1;
		else if ( !isNaN(cur)) obj[vals] = cur + 1;
		else if ( typeof cur === 'object') {
			// NOTE: if cur.value is NaN there is no consistent merge strategy.
			cur.value = (cur.value || 0) + 1;
		}

	} else if ( typeof vals === 'object') {

		for( let p in vals ) {

			let cur = obj[p];
			let src = vals[p];

			if ( !cur ) {

				obj[p] = !isNaN(src) ? src : clone(src);

			} else if ( typeof cur === 'object') {

				if ( typeof src === 'object') addValues( cur, src);
				else cur.value = (cur.value || 0 ) + src;

			} else if ( typeof src === 'object') {

				src = obj[p] = clone(src);
				src.value = (src.value||0) + cur;

			} else {

				obj[p] = (cur||0) + src;
			}


		}

	}

}

/*const addKeyVal = ( obj, k, v ) => {

	let cur = obj[k];
	if ( !cur ) obj[k] = v;
	else if ( typeof cur === 'object' ) {



	} else {

		if ( typeof v === 'object') {

			obj[k] = clone( v );
			obj[k].value = ( obj[k].value || 0 ) + cur;

		} else obj[k] = cur + v;

	}

}*/