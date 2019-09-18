import Inventory from "./inventory";
import { ALLY } from "./npc";
import Events, { ALLY_DIED } from '../events';
import Stat from "../stat";

export default class Minions extends Inventory {

	/**
	 * @property {Stat} allies - level max allies taken into battle.
	 */
	get maxAllies() { return this._maxAllies; }
	set maxAllies(v) {
		this._maxAllies = v instanceof Stat ? v : new Stat(v);
	}

	/**
	 * @property {number} allyTotal - sum of all allies levels.
	 */
	get allyTotal() { return this._allyTotal; }

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

			var it = this.items[i];
			if ( it.active === false && it.alive ) it.rest(dt);

		}

	}

	add(m ) {

		super.add(m);

		m.team = ALLY;

		if ( m.active ) {
			this.setActive(m)
		}


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

		if ( active === true ) {

			if ( b.level + this.allyTotal > this.maxAllies ) return false;
			if ( !this.active.includes(b) ) {

				this.allyTotal += b.level;
				this.active.push(b);

			}

		} else {

			let ind = this.active.indexOf(b);
			if ( ind >= 0 ) {

				this.allyTotal -= b.level;
				this.active.splice(ind,1);

			}

		}

		b.active = active;

	}

	revive( state ) {

		super.revive(state);

		if ( this.maxAllies === null ) {
			this.maxAllies = Math.floor( state.player.level / 5 );
		}

		let max = this.maxAllies.value;

		for( let p in this.items ) {

			var m = this.items[p];
			if ( m.active && m.level <= max ) {

				max -= m.level;
				this._active.push(m);

			}

			/** @compatibiltiy */
			m.team = ALLY;

		}

		this.allyTotal = this.maxAllies.value - max;

		Events.add( ALLY_DIED, this.died, this );

	}

	/**
	 * Reset the active list for any minions that have died,
	 * gone inactive, etc.
	 */
	resetActives() {

		for( let i = this.active.length-1; i>=0; i-- ) {

			if ( !this.active[i].active ) {
				this.setActive( this.active[i], false );
			}

		}

	}

	remove( m ) {

		super.remove(m);

		console.log('removing minion: ' + m.id );
		this.setActive( m, false );

	}

	died( m ) {

		m.active = false;

	}

}