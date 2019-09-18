import Inventory from "./inventory";
import { ALLY } from "./npc";
import Events, { ALLY_DIED } from '../events';

export default class Minions extends Inventory {

	/**
	 * @property {string[]}
	 */
	get active() { return this._active; }
	set active(v) { this._active = v; }

	constructor(vars=null){

		super(vars);

		this.type = this.id = "minions";

		if ( !this.max ) this.max = 0;

		this._active = [];

	}

	update(dt) {

		for( let i = this.items.length-1; i>= 0; i-- ) {

			if ( this.items[i].active === false ) this.items[i].rest(dt);
		}

	}

	add(m ) {

		super.add(m);
		if ( m.active ) this.active.push(m);
		m.team = ALLY;

	}

	/**
	 * Get list of Minions by id.
	 * @param {string[]} ids
	 */
	getList( ids ) {
		return this.items.filter( v=>ids.includes(v.id) );
	}

	setActive( b, active=true ) {

		if ( !b.alive ) return;

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

			/** @compatibiltiy */
			m.team = ALLY;

		}

		Events.add( ALLY_DIED, this.died, this );

	}

	/**
	 * Reset the active list for any minions that have died,
	 * gone inactive, etc.
	 */
	resetActives() {

		for( let i = this.active.length-1; i>=0; i-- ) {
			if ( !this.active[i].active ) this.active.splice(i, 1 );
		}

	}

	remove( m ) {

		super.remove(m);

		console.log('removing miinon: ' + m.id );
		let ind = this.active.indexOf(m);
		if ( ind>=0)this.active.splice(ind,1);

	}

	died( m ) {
		m.active = false;
		//this.remove(m);
	}

}