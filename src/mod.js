import Percent from './percent';
import Stat from './stat';

export const ModTest = /^([\+\-]?\d+\.?\d*\b)?(?:([\+\-]?\d+\.?\d*)\%)?$/i;

/**
 * Modifier for mod without id.
 */
export const DEFAULT_MOD = 'all';

export default class Mod {

	toJSON(){

		var val = this._pct === 0 ? this.bonus : (
			(this.bonus || '') + (( this._pct > 0 ? '+' : '') + (100*this._pct)  + '%')
		);

		return {
			id:this.id,
			value:val,
			count:this.count
		};

	}

	toString() {
		let s = this.bonus !== 0 ? this.bonus : '';
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
	 * Update the modifier with additional values.
	 * @param {number|Percent|Object} mod
	 * @param {number} [amt=1]
	 */
	apply( mod, amt=1 ) {

		console.warn('CHANGING MOD: ' + this.id + ' by mod: ' + (mod.id||typeof mod) );

		let typ = typeof mod;
		if ( typ === 'number') {

			this.bonus += amt*mod;

		} else if ( mod instanceof Percent ) {

			this.pct += amt*mod.pct;

		} else if ( typ === 'object') {

			this.bonus += amt*mod.bonus || 0;
			this.pct += amt*mod.pct || 0;

		}


	}

	/**
	 * Apply this modifier to a given target.
	 * This is a one-time modify and doesnt use count total.
	 * @param {Object} obj - owner of the property being modified.
	 * @param {string} p - target property to which mod is being applied.
	 * @param {number} amt
	 */
	applyTo( obj, p, amt ) {

		let targ = obj[p];
		if ( targ instanceof Stat ) targ.applyMod( this, amt );
		else if ( targ instanceof Mod) targ.apply( this, amt );
		else if ( typeof targ === 'object') {

			targ.value = ( ( Number(targ.value) || 0 ) + amt*this._bonus )*( 1 + amt*this._pct );

		} else if ( typeof targ === 'number' ) obj[p] = ( targ + amt*this._bonus )*(1 + amt*this._pct );

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