import {getPropDesc} from 'objecty';

/**
 * Find an item in an array matching predicate, remove and return it.
 * @param {Array} a
 * @param {*} pred
 * @returns {object|null} Item removed or null.
 */
export const findRemove = (a,pred) => {

	for( let i = a.length-1; i>= 0; i-- ) {

		if ( pred(a[i] ) ) {

			let res = a[i];
			a.splice( i, 1 );
			return res;

		}

	}
	return null;

}

/**
 * Log all public properties.
 * @param {*} src
 */
export function logPublic( src ) {

	let a = [];

	while ( src !== Object.prototype ) {

		for( let p of Object.getOwnPropertyNames(src) ) {

			if ( p[0] === '_'){continue; }
			a.push(p);
		}
		src = Object.getPrototypeOf(src);

	}

	console.log('PUBLIC: ' + a.join(',' ) );

}

export function assignNoFunc( dest, src ) {

	var vars = src;
	while ( vars !== Object.prototype ) {

		for( let p of Object.getOwnPropertyNames(vars) ) {

			if ( p[0] === '_' || typeof src[p] === 'function'){
				continue;
			}

			var desc = getPropDesc(dest, p);
			if ( desc && (!desc.writable && desc.set === undefined) ) {
				//console.log('SKIPPING: ' + p);
				continue;
			}

			dest[p ] = src[p];

		}
		vars = Object.getPrototypeOf(vars);

	}

	return dest;

}

export function assignPublic( dest, src ) {

	var vars = src;
	while ( vars !== Object.prototype ) {

		for( let p of Object.getOwnPropertyNames(vars) ) {

			if ( p[0] === '_'){
				continue;
			}

			var desc = getPropDesc(dest, p);
			if ( desc && (!desc.writable && desc.set === undefined) ) {
				console.log('SKIPPING: ' + p);
				continue;
			}

			dest[p ] = src[p];

		}
		vars = Object.getPrototypeOf(vars);

	}

	return dest;

}


export function showObj(obj) {

	if ( Array.isArray(obj)){

		return '[ \n' + obj.map(v=>showObj(v)).join(', ') + '\n ]';

	} else if ( typeof obj === 'object') {

		let s = '{ ';
		for( let p in obj ) {

			s += `\n${p}: ` + showObj(obj[p] );

		}
		s += '\n}';

		return s;

	} else return '' + obj;


}

export function logObj( obj, msg='' ) {
	console.log( (msg ? msg + ': ' : '' ) + showObj(obj) );
}

export const randElm = (arr)=>{
	const ind = Math.floor( Math.random()*(arr.length));
	return arr[ind];
}

/**
 * Returns a random between [min,max]
 * @param {number} min
 * @param {number} max
 */
export const random = (min, max)=>{
	return min + Math.round( Math.random()*(max-min) );
}


export const uppercase = (s) => {
	return !s ? '' : (s.length > 1 ? s[0].toUpperCase() + s.slice(1) : s[0].toUpperCase());
}

/**
 * NOTE: Not reactive with Vue.
 * @param {*} a
 * @param {*} i
 */
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