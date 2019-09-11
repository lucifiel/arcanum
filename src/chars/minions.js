import Npc from "./npc";
import Inventory from "./inventory";

export default class Minions extends Inventory {

	get minions() { return this._minions; }
	set minions(v) {

		for( let i = v.length-1; i>=0; i-- ) {
			v[i] = v[i] instanceof Npc ? v[i] : new Npc(v[i]);
		}

		this._minions = v;

	}

	/**
	 * @property {string[]}
	 */
	get active() { return this._active; }
	set active(v) { this._active = v; }

	constructor(vars=null){

		super(vars);

	}

	add( m ) {

		this.minions.push(m);

	}

	remove( m ) {

		let ind = this.minions.indexOf( m );
		if ( ind >= 0 ) {
			this.minions.splice(ind,1);
		}

	}

	died() {
	}

}