/**
 * Formatting helpers for HTML/Display.
 */

export function seconds(v){
	return Math.ceil(v) + ' s';
}

export function round( v ) {
	return (v === null || isNaN(v)) ? 0 : Math.floor(v);
}