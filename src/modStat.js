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

	get mods() { return this._mods; }
	set mods(v) {

		for( let i = v.length-1; i>=0;i--){

			var mod = v[i];
			if ( mod instanceof Mod ) continue;
			v[i] = new Mod( v[i] );
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
		this._bonus = this._bonus || 0;
		this._pct = this._pct || 0;

		this._rate = this._rate || null;

		this.mods = this.mods || [];

	}

	/**
	 * Add a modifier to the stat.
	 * @param {} mod 
	 */
	addMod(mod) {

		this._pct += mod.pct;
		this._bonus += mod.bonus;

		let cur = this.mods.find( v=>v.id===mod.id );
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

		let len = this.mods.length;
		for( let i = 0; i < len; i++ ) {

			var mod = this._mods[i];
			pct += mod.pct;
			bonus += mod.bonus;
		}

		this._pct = pct;
		this._bonus = bonus;

	}

}