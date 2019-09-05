export default class Combat {

	toJSON() {

		return {
			enemies:this._enemies,
			allies:this.allies,
		}

	}

	/**
	 * @property {Npc[]} enemies - enemies in the combat.
	 */
	get enemies() { return this._enemies; }
	set enemies(v) {

		for( let i = v.length-1; i>= 0; i--) v[i] = new Npc(v);
		this._enemies = v;
	}

	/**
	 * @property {Npc[]} allies - creatures fighting for player.
	 */
	get allies() { return this._allies; }
	set allies(v) { this._allies=v; }

	get complete() {
	}
	set complete(v) {
	}

	constructor(vars=null ) {

		if ( vars ) Object.assign(this,vars);

		this._enemies = this._enemies || [];
		this._allies = this._allies || [];

	}

	revive( state ){
	}

	update( dt ) {
	}

}