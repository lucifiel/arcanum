/**
 * Formatting helpers for HTML/Display.
 */

export function seconds(v){
	return Math.ceil(v) + ' s';
}

export function floor( v ) {
	return (v === null || isNaN(v)) ? 0 : Math.floor(v);
}

export function ceil( v ) {
	return (v === null || isNaN(v)) ? 0 : Math.ceil(v);
}


export function round( v ) {
	return (v === null || isNaN(v)) ? 0 : Math.round(v);
}