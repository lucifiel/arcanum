export const uppercase = (s) => {
	return s.length > 1 ? s[0].toUpperCase() + s.slice(1) : s[0].toUpperCase();
}

export const quickSplice = ( a, i ) => {

	a[i] = a[ a.length-1 ];
	a.pop();

}


export const indexAfter = ( s, k ) => {

	let i = s.indexOf(k);
	return i >= 0 ? i + k.length : i;

}

/**
 * Merge two items which may or may not be arrays,
 * and return a ray containing the flattened result of both.
 * If either a or b is already an array, it will be used to join
 * the results in-place.
 * @param {*} a
 * @param {*} b
 * @return {Array}
 */
export const arrayMerge = ( a, b ) => {

	if ( Array.isArray(a) ) {

		if ( Array.isArray(b) ) return a.concat(b);

		a.push(b);

		return a;

	} else if ( Array.isArray(b) ) {

		// a is not array:
		b.push(a);
		return b;

	} else return [a,b];

}