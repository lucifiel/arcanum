import {StatRE } from './stat';

export default class Mod {

	toJSON(){

		var val = this.bonus + ( this._pct ?
			( this._pct > 0 ? '+' : '') + this._pct : '') + '%';

		return {
			id:this.id,
			value:val
		};

	}

	/**
	 * @property {string} id
	 */
	get id() { return this._id; }
	set id(v) { this._id = v; }

	/**
	 * @property {number} pct - pct modified.
	 */
	get pct() { return this._pct; }
	set pct(v) { this._pct = v; }

	/**
	 * @property {number} bonus - base modifier.
	 */
	get bonus() { return this._bonus; }
	set bonus(v) { this._bonus = v; }

	set value(v) {

		if ( typeof v ==='string'){

			res = StatRE.exec( v);
			if ( res ) {
				this.bonus = Number(res[0]);
				this.pct = Number(res[1]) || 0;
			}


		} else if ( !isNaN(v) ) this.bonus = v;

	}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );

	}

}