import Mod, { ModTest } from 'values/mod';
import PerValue, { IsPerValue } from 'values/pervalue';
import { splitKeys, logObj } from '../util/util';
import { SubPath } from '../values/rvalue';

/**
 * Parse object into modifiers.
 * @param {} mods
 * @returns {Object} parsed modifiers.
 */
export const ParseMods = ( mods, id, source ) => {

	if ( !mods ) return null;
	if (!id) {
		if ( source ) id = source.id;
		if ( !id ) {
			id = '';
			logObj( mods, 'invalid mod: ' + id );
		}
	}

	mods = SubMods( mods, id, source );
	if ( !mods ) console.warn('mods is null: ' + id );

	// @todo: no more key splitting. item tables?
	splitKeys(mods);

	return mods;

}

/**
 *
 */
export const SubMods = ( mods, id, source )=>{

	if ( mods === null || mods === undefined ) return null;

	if ( typeof mods === 'string' ) {
		//console.log('testing mod: ' + mods );
		if ( ModTest.test(mods) ) {
			return new Mod( mods, id, source );
		} else if ( IsPerValue(mods)) {
			return new PerValue( mods, id, source );
		}

		console.warn('invalid str mod: ' + mods );
		return mods;

	} else if ( typeof mods === 'number') {
		return new Mod( mods, id, source );
	} else if ( typeof mods !== 'object' ) return mods;

	// @note str is @compat
	if ( mods.id || mods.base || mods.str ) return new Mod( mods, id, source );

	for( let s in mods ) {

		let val = mods[s];
		if ( !val) continue;

		if ( val instanceof Mod ) {

			if ( id ) val.id = SubPath(id, s);
			val.source = source;
			continue;

		}

		mods[s] = SubMods( val, SubPath(id, s), source );

	}
	return mods;

}