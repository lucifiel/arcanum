import Mod from "./mod";

const AT_SYM = '?';
const AtRegEx = /^([0-9.]+)?\?([0-9.]+)$/;

/**
 *
 * @param {string} v
 * @returns {boolean}
 */
export const IsAtMod = (v)=>{ return AtRegEx.test(v); }

/**
 * Apply modifier only once, or not at all.
 */
export default class OnceMod extends Mod {

	toJSON(){ return this.at + AT_SYM + this.value; }

	/**
	 * @property {number} at = source value at which mod value will be applied.
	 */
	get at(){ return this._at; }
	set at(v) { this._at = v}

	/**
	 * @property {number} count - apply once max.
	 */
	get count(){
		return (this.source && this.source.value > this.at) ? 1 : 0;
	}

	toString(){ return this.value  + ' (once)'; }

	constructor(vars, id, source ) {

		super( 0, id, source );

		if ( typeof vars === 'string') {

			let res = AtRegEx.match( vars );
			if ( res ) {

				if ( res.length >= 3 ) {

					this.at = res[1];
					this.value = res[2];

				} else {
					this.value = res[1];
					this.at = 1;
				}

			} else {
				this.value = 0;
				this.at = 1;
			}


		} else {
			console.log('bad AtMod: ' + vars );
			this.value = Number(vars) || 0;
			this.at = 1;
		}

	}

	/**
	 *
	 * @param {*} gs
	 * @param {*} targ
	 */
	getApply(gs, targ) {
		return this.source && ( this.source.value >= this.at ) ? this.value : 0;
	}


}