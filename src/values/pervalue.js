import Mod from "./mod";

const PER_SYM = '/';
const PerRegEx = /^(\d+)?\/(\d+)$/ig;

/**
 *
 * @param {string} v
 * @returns {boolean}
 */
export const IsPerValue = (v)=>{
	return PerRegEx.test(v);
}

/**
 * Apply result only on value%modulus === 0
 */
export default class PerValue extends Mod {

	toJSON(){ return this.value + PER_SYM + this.per; }

	/**
	 * @property {number} count - apply modulus mod once per modulus factor.
	 */
	get count(){
		return this.owner ? Math.floor(this.owner.value / this.value ) : 0;
	}

	/**
	 * @property {number} per - value applied only once for every per unit
	 * of count.
	 */
	get per(){return this._per;}
	set per(v){this._per = v;}

	toString(){ return this.value + PER_SYM + this.per }

	constructor(vars, id, owner ) {

		super( 0, id, owner );

		if ( typeof vars === 'number') {

			this.value = 1;
			this.per = vars;

		} else if ( typeof vars === 'string') {

			let parts = vars.split( PER_SYM );

			if ( parts.length >= 2 ) {

				this.value =  isNaN(parts[0]) ? 1 : Number(parts[0]);
				this.per = Number(parts[1]) || 1;

			} else {
				console.warn('Invalid modulus: ' + vars );
				this.value = 0;
				this.per = 1;
			}

		} else {
			console.log('unexpected per: ' + vars );
			this.value = Number(vars);
		}

		console.log( this.id + ' PERVAL: ' + this.toString() );
	}

	/**
	 *
	 * @param {*} gs
	 * @param {*} targ
	 */
	getApply(gs, targ) {
		return ( this.count % this.per ) === 0 ? this.value : 0;
	}


}