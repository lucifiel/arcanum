
export const StatRe = /^\d*(\+\d+)?$/i;

export default class Stat {

	get value() { return this._base*( 1 + this._pct ); }

	get base() { return this._base; }
	set base(v) { this._base = v; }

	get pct() { return this._pct; }
	set pct(v) { this._pct = v; }

	valueOf() { return this._base*( 1 + this._pct ); }

	constructor( vars=null ) {

		if ( !isNaN(vars) ) {
			this._base = vars;
			this._pct = 0;
		} else if ( vars instanceof Object ) Object.assign(this,vars);
		else if ( typeof vars === 'string') {

		}

		this._pct = this._pct||0;
		this._base = this._base||0;

	}


}