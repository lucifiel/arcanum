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

		this.mods = this.mods || [];

	}

	addMod(mod) {

		let cur = this.mods.find( v=>v.id===mod.id );
		if ( cur ) {


		} else {

			this.mods.push(mod);

		}

	}

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