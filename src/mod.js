import Percent from './percent';

export const ModTest = /^([\+\-]?\d+\.?\d*\b)?(?:([\+\-]?\d+\.?\d*)\%)?$/i;

/**
 * Modifier for mod without id.
 */
export const DEFAULT_MOD = 'all';

export default class Mod {

	toJSON(){

		var val = this.bonus + ( this._pct ?
			( this._pct > 0 ? '+' : '') + (100*this._pct)  + '%' : '' );

		return {
			id:this.id,
			value:val,
			count:this.count
		};

	}

	toString() {
		let s = ( this.id ? this.id + ': ' : '') + this.bonus;
		if ( this._pct !== 0 ) {
			s += ( this._pct > 0 ? '+' : '' ) + this._pct + '%';
		}
		return s;
	}

	/**
	 * @property {string} [id=DEFAULT_MOD]
	 */
	get id() { return this._id; }
	set id(v) { this._id = v; }

	/**
	 * @property {number} [count=0] - number of times mod is applied.
	 */
	get count() { return this._count; }
	set count(v) { this._count = v; }

	/**
	 * @property {number} [pct=0] - pct as a decimal.
	 */
	get pct() { return this._pct; }
	set pct(v) { this._pct = v; }

	/**
	 * @property {number} [bonus=0] - base modifier. (constant added bonus)
	 */
	get bonus() { return this._bonus; }
	set bonus(v) { this._bonus = v; }

	set value(v) {

		if ( typeof v ==='string' ){

			let res = ModTest.exec( v);

			if ( res ) {

				//res.forEach((v,i)=>console.log('reg['+i+']: ' + v ));
				this.bonus = Number(res[1]) || 0;
				this.pct = Number(res[2])/100 || 0;
			} else console.log('no mod regex: ' + v );


		} else if ( v instanceof Percent ) {

			this.pct = v.value;

		} else if ( !isNaN(v) ) this.bonus = v;

	}

	/**
	 * Modify the modifier. Count stays fixed.
	 * @param {number|Percent|Object} mod
	 * @param {number} [amt=1]
	 */
	apply( mod, amt=1 ) {

		let typ = typeof mod;
		if ( typ === 'number') {

			this.bonus += amt*mod;

		} else if ( mod instanceof Percent ) {

			this.pct += amt*mod.pct;

		} else if ( typ === 'object') {

			this.bonus += amt*type.bonus || 0;
			this.pct += amt*type.pct || 0;

		}


	}

	/**
	 *
	 * @param {?Object} [vars=null]
	 */
	constructor( vars=null, id=null ){

		if ( typeof vars === 'number') this._bonus = vars;
		else if ( typeof vars === 'string') this.value = vars;
		else if ( vars ) Object.assign( this, vars );

		this._count = this._count || 0;
		this._bonus = this._bonus || 0;
		this._pct = this._pct || 0;

		this.id = this.id || id || DEFAULT_MOD;

		//console.log(this.id + ' mod created: ' + this.bonus + ' +' +this.pct+'%');
	}

}