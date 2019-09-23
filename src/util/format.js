const postfixes = [

	'k', 'm', 'b'
]

/**
 * Formatting helpers for HTML/Display.
 */
export const precise = (v, n=2) => {

	if ( isNaN(v) ) return v;
	else v = Number(v);

	if ( v > 1 ) return v.toFixed(n);

	if ( Math.pow(10,n)*v < 1 ) n += 2;
	return v.toFixed(n);
}


export const fixed = (v, n=2) => {
	return ( typeof v === 'number') ? v.toFixed(n) : v;
}

export const seconds = (v) => {
	return Math.ceil(v) + ' s';
}

export const floor = ( v ) => {
	return (v === null || isNaN(v)) ? 0 : Math.floor(v);
}

export const ceil = ( v ) => {
	return (v === null || isNaN(v)) ? 0 : Math.ceil(v);
}


export const round = ( v ) => {
	return (v === null || isNaN(v)) ? 0 : Math.round(v);
}