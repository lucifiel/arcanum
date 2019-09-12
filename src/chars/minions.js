import Inventory from "./inventory";

export default class Minions extends Inventory {

	/**
	 * @property {string[]}
	 */
	get active() { return this._active; }
	set active(v) { this._active = v; }

	constructor(vars=null){

		super(vars);

		if ( !this.max ) this.max = 0;

		this._active = [];

	}

	/**
	 * Get list of Minions by id.
	 * @param {string[]} ids
	 */
	getList( ids ) {
		return this.items.filter( v=>ids.includes(v.id) );
	}

	setActive( b, active=true ) {

		b.active = active;

		if ( active === true ) {

			if ( !this.active.includes(b) )this.active.push(b);

		} else {

			let ind = this.active.indexOf(b);
			if ( ind >= 0 ) this.active.splice(ind,1);

		}

	}

	revive( state ) {

		super.revive(state);

		for( let p in this.items ) {

			var m = this.items[p];
			if ( m.active ) this._active.push(m);
		}

	}

	remove( m ) {

		super.remove(m);

		console.log('removing miinon: ' + m.id );
		let ind = this.active.indexOf(m);
		if ( ind>=0)this.active.splice(ind,1);

	}

	died( m ) {
		this.remove(m);
	}

}