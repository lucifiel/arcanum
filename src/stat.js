export const StatRe = /^([\+\-]?\d+)(?:([\+\-]\d+)\%)?$/i;

export default class Stat {

	toJSON(){
		return this._base + (this._pct >= 0 ? '+' : '') + (100*this._pct) + '%';
	}

	toString(){
		return this._base + (this._pct >= 0 ? '+' : '') + (100*this._pct) + '%';
	}

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

			let res = StatRe.exec( vars );
			this.base = res[1];
			this.pct = res.length > 2 ? Number(res[2])/100 : 0;

		}

		this._pct = this._pct||0;
		this._base = this._base||0;

	}

	/**
	 * Get the result of changing the base and percents by the given amounts.
	 * @param {number} delBase - delta base.
	 * @param {number} delPct - delta percent.
	 * @returns {number}
	 */
	newValue( delBase, delPct ) {
		return (this._base + delBase )*( 1 + this._pct + delPct );
	}

	add( v ) {

		if ( !isNaN(v)) this._base += v;
		else if ( v instanceof Object ) {

			this._base += v.base ? v.base : 0;
			this._pct += v.pct ? v.pct : 0;

		}

	}

}