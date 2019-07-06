export default class StatMod {

	get id() { return this._id; }
	set id(v) { this._id = v; }

	/**
	 * @property {BigInt} pct
	 */
	get pct() { return this._pct; }
	set pct(v) { this._pct = v; }

	constructor( vals ){

		if ( vals ) Object.assign( this, vals );
		if ( !this._pct ) this._pct = 0n;

	}

}