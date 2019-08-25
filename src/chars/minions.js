import Npc from "./npc";

export default class Minions {

	get minions() { return this._minions; }
	set minions(v) {

		for( let i = v.length-1; i>=0; i-- ) {
			v[i] = v[i] instanceof Npc ? v[i] : new Npc(v[i]);
		}

		this._minions = v;

	}

	constructor(vars=null){

		if ( vars ) Object.assign( this, vars );

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