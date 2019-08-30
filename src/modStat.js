import Mod from "./mod";

/**
 * Stat with a list of modifications.
 */
export default class ModStat {

	toJSON(){

		return {
			base:this._base,
			mods:this._mods,
			pct:this._pct,
			bonus:this._bonus
		}

	}

	toString(){
		return this._base + (this._pct >= 0 ? '+' : '') + (100*this._pct) + '%';
	}

	get value() { return (this._base + this._bonus)*( 1 + this._pct ); }
	valueOf() { return (this._base + this._bonus)*( 1 + this._pct ); }

	get base() { return this._base; }
	set base(v) { this._base = v; }

	/**
	 * @property {number} bonus - total bonus to base.
	 */
	get bonus(){return this._bonus; }

	/**
	 * @property {number} pct - total pct bonus.
	 */
	get pct() { return this._pct };

	/**
	 * @property {Object.<string,Mod>} mods - mods applied to object.
	 */
	get mods() { return this._mods; }
	set mods(v) {

		for( let p in v ) {

			var mod = v[p];
			if ( mod instanceof Mod ) continue;
			v[p] = new Mod( v[p] );
		}
		this._mods = v;
	}

	/**
	 * 
	 * @param {Object|number} vars 
	 */
	constructor( vars=null ) {

		if ( typeof vars === 'object') {

			if ( vars ) Object.assign( this, vars );

		} else if ( !isNaN(vars) ) this._base = Number(vars);

		this._base = this._base||0;

		this._rate = this._rate || null;

		this.mods = this.mods || {};
		this.recalc();

	}

	/**
	 * Add a modifier to the stat.
	 * @param {} mod 
	 */
	addMod( mod ) {

		this._pct += mod.pct;
		this._bonus += mod.bonus;

		let cur = this.mods[mod.id];
		if ( cur ) {

			cur.pct += mod.pct;
			cur.bonus += mod.bonus;

		} else {

			this.mods.push(mod);

		}

	}

	/**
	 * Recalculate the total bonus and percent applied to stat.
	 */
	recalc(){

		let bonus = 0, pct = 0;

		for( let p in this._mods ) {

			var mod = this._mods[p];
			pct += mod.pct;
			bonus += mod.bonus;

		}

		this._pct = pct;
		this._bonus = bonus;

	}

}