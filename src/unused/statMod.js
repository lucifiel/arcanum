export default class StatMod {

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
	 * @property {number} base - base modifier.
	 */
	get base() { return this._base; }
	set base(v) { this._base = v; }

	/**
	 * @property {Item} source - owning Item of the stat mod.
	 * This Object's value determines the amount the mod is applied.
	 */
	get source() { return this._source; }
	set source(v) { this._source=v; }

	/**
	 * @property {Stat} srcStat - stat controlling the modified value.
	 */
	get srcStat() { return this._srcStat; }
	set srcStat(v) { this._srcStat = v; }

	/**
	 * @property {Stat} destStat - stat being modified.
	 */
	get destStat() { return this._destStat; }
	set destStat(v) { this._destStat = v; }

	/**
	 * @property {Item} target - destination stat owner.
	 */
	get target() { return this._target; }
	set target(v) { this._target = v;}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );

	}

	/**
	 * Item source value changed.
	 * @param {*} delta 
	 */
	valChange( delta ) {

		target.addAmd( delta*srcStat.value );

	}

	/**
	 * stat mod-value changed.
	 */
	statChange( delta ) {

		// remove previous mod.
		target.addAmt( -source.value*( srcStat.value + delta ) )
		target.addAmt( source.value*( srcStat.value ) );

	}

}