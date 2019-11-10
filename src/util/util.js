import {getPropDesc, clone} from 'objecty';

/**
 * alphabetical sort.
 * @param {*} a
 * @param {*} b
 */
export const alphasort = (a,b)=> a.name < b.name ? -1 : 1;

/**
 * Map Array into non-null elements of a predicate.
 * @param {Arrray} a
 * @param {function} p
 */
export const mapNonNull = (a,p) => {

	let len = a.length;
	let b = [];
	for( let i = 0; i < len; i++ ) {

		var elm = p( a[i]);
		if ( elm !== null && elm !== undefined) b.push(elm);

	}

	return b;

}

/**
 *
 * @param {array} a
 * @param {array} b
 */
export const pushNonNull = (a,b) => {

	let len = b.length;
	for( let i = 0; i < len; i++ ) {
		var e = b[i];
		if ( e !== null && e !== undefined ) a.push( e );
	}
	return a;

}

/**
 * Return first non-null element of array.
 * @param {Array} a
 */
export const first = (a) =>{

	let len = a.length;
	for( let i = 0; i < len; i++) {
		var e = a[i];
		if ( e !== null && e !== undefined ) return i;
	}

}

/**
 * Ensure the existence of props on an object.
 * Mostly for Vue reactivity.
 * @property {Object} obj
 * @property {string[]} props - props to set.
 */
export const ensure = ( obj, props ) => {

	for( let i = props.length-1; i>= 0; i-- ) {
		var s = props[i];
		if ( !obj.hasOwnProperty(s) ) obj[s] = null;
	}

}

/**
 * Performs a deep-clone of an object, including class prototype
 * and class methods.
 * @param {Object} src
 * @param {?Object} [dest=null] - optional base object of the clone.
 * if set, root object will not be cloned, only subobjects.
 */
export const cloneClass = ( src, dest=null ) => {

	let o;

	if ( !dest ) {
		let proto = Object.getPrototypeOf( src );
		dest = Array.isArray(src) ? [] : ( proto ? Object.create( proto ) : {} );
	}

	for( let p in src ) {

		o = src[p];

		var def = getPropDesc( dest, p );
		if ( def && ( !def.writable || def.set === undefined ) ) continue;

		if ( o === null || o === undefined ) dest[p] = o;
		else if ( typeof o === 'object' ) {

			if ( o.clone && typeof o.clone === 'function' ) dest[p] = o.clone.call( o );
			else dest[p] = cloneClass( o );

		} else dest[p] = o;

	}

	return dest;

}

/**
 * Only assign values already defined in dest's protochain.
 * @param {*} dest
 * @param {*} src
 */
export const assignOwn = (dest, src ) => {

	var vars = Object.getPrototypeOf(dest);
	while ( vars !== Object.prototype ) {

		for( let p of Object.getOwnPropertyNames(vars) ) {

			var desc = getPropDesc(dest, p);
			if ( desc && (!desc.writable && desc.set === undefined) ) {
				continue;
			}

			if ( src[p] !== undefined ) dest[p] = src[p];

		}
		vars = Object.getPrototypeOf(vars);

	}

	return dest;

}

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
export const logPublic = ( src ) => {

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

/**
 * NOTE: Merge over undefined and null values.
 * @param {*} dest
 * @param {*} src
 */
export const mergeDefined = ( dest, src ) => {

	for( let p in src ) {

		var destSub = dest[p];
		let srcSub = src[p];

		if ( destSub === undefined || destSub === null ) {

			if ( srcSub !== null && typeof srcSub === 'object' ) dest[p] = clone( srcSub, Array.isArray(srcSub) ? [] : {} );
			else dest[p] = srcSub;

			continue;

		}

		if ( srcSub && typeof destSub === 'object' && typeof srcSub === 'object') {
			if ( !Array.isArray(destSub) && !Array.isArray(srcSub) ) mergeDefined( destSub, srcSub );
		}

	}

}

export const assignNoFunc = ( dest, src ) => {

	var vars = src;
	while ( vars !== Object.prototype ) {

		for( let p of Object.getOwnPropertyNames(vars) ) {

			if ( p[0] === '_' || typeof src[p] === 'function'){
				continue;
			}

			var desc = getPropDesc(dest, p);
			if ( desc && (!desc.writable && desc.set === undefined) ) {
				continue;
			}

			dest[p ] = src[p];

		}
		vars = Object.getPrototypeOf(vars);

	}

	return dest;

}

	/**
	 * For an object variable path key, the key is expanded
	 * into subojects with keys from the split key path.
	 * This is done to allow object props to represent variable paths
	 * without changing all the code to use Maps (with VarPath keys) and not Objects.
	 * @param {Object} obj - object containing the key to expand.
	 * @param {string} prop - key being split into subobjects.
	 */
	export const splitKeyPath = ( obj, prop ) => {

		let val = obj[prop];
		delete obj[prop];

		let keys = prop.split('.');

		let max = keys.length-1;

		// stops before length-1 since last assign goes to val.
		for( let i = 0; i < max; i++ ) {

			var cur = obj[ keys[i] ];

			if ( cur === null || cur === undefined ) cur = {};
			else if ( (typeof cur) !== 'object' || cur.constructor.name !=='Object' ) cur = { value:cur };

			obj = (obj[ keys[i] ] = cur);

		}

		obj[ keys[max] ] = val;

	}

export const assignPublic = ( dest, src ) => {

	var vars = src;
	while ( vars !== Object.prototype ) {

		for( let p of Object.getOwnPropertyNames(vars) ) {

			if ( p[0] === '_'){
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


export const showObj = (obj) => {

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

export const logObj = ( obj, msg='' ) => {
	console.log( (msg ? msg + ': ' : '' ) + showObj(obj) );
}

export const randElm = (arr)=>{
	if ( arr === null || arr === undefined ) return null;

	const ind = Math.floor( Math.random()*(arr.length));
	return arr[ind];
}

/**
 * Returns a random number between [min,max]
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