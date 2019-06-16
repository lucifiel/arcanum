/**
 * Formatting helpers for HTML/Display.
 */


 /**
  * @constant {RegEx} priceRE
  */
 const priceRE = /\s*\$(\d+\.?\d{0,2}|\d*\.\d{1,2})\s*/i;

/**
 * Formats a dollar number.
 * @param {number|*} v
 * @return {string}
 */
export function price(v) {
	return (v === null || isNaN(v)) ? '$0.00' : `$${Number(v).toFixed(2)}`;
}

export function round( v ) {
	return (v === null || isNaN(v)) ? 0 : Math.floor(v);
}

/**
 * Convert price string to numeric value.
 * @param {string|number} v
 * @returns {number}
 */
export function priceToNum(v) {

	if ( !isNaN(v)) return Number(v);
	let res = priceRE.exec( v );
	if ( !res ) return 0;
	return Number(res[1] );

}

export default {
	price:price
};