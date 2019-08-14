import Range from "../range";

export default class Dot {

	toJSON(){

		return {

			id:this.id || undefined,
			kind:this.kind || undefined,
			name:this.name || undefined,
			dmg:this.damage || undefined,
			acc:this.acc,
			duration:this.duration,
			source:this.source ? this.source.id : undefined
		};

	}

	set dmg(v) { this.damage = v; }

	get damage() { return this._damage; }
	set damage(v) {

		if ( v instanceof Range ) this._damage = v;
		else if ( !isNaN(v) ) this._damage = Number(v);
		else if ( typeof v === 'string' || typeof v === 'object') this._damage = new Range(v);

	}

	constructor( vars, source, name ){

		Object.assign( this, vars );

		this.id = this.id || (source ? source.id : '');
		this.name = name || this.name || ( source ? source.name : '' );

		this.source = this.source || null;

		/**
		 * @property {boolean} stack - ability of dot to stack.
		 */

		/**
		 * @private {number} acc - integer accumulator
		 */
		this.acc = 0;

	}

	revive(state) {
		if ( this.source && typeof this.source === 'string') this.source = state.getItem( this.source );
	}

	/**
	 * Ticks dt and returns the amount the dot has actually ticked,
	 * (allowing for seconds-only updates.)
	 * @param {number} dt 
	 */
	tick(dt) {

		this.acc += dt;
		if ( this.acc >= 1 ) {

			this.acc--;
			this.duration--;
			return 1;

		}

		return 0;

	}

}