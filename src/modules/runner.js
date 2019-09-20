import Game from '../game';
import {quickSplice} from '../util/util';
import Events, {ACT_DONE, ACT_CHANGED} from '../events';
import Stat from '../stat';

/**
 * Tracks running/perpetual actions.
 */
export default {

	toJSON() {

		return {

			waiting:waiting.map(v=>v.id),
			actives:actives.map(v=>v.id)
		};

	},

	/**
	 * @property {number} running - number currently running.
	 */
	get running(){return this.actives.length; },

	get max() { return this._max; },
	set max(v) {

		if ( v instanceof Stat ) {

			this._max =v;

		} else if ( !this._max ) this._max = new Stat(v);
		else if ( typeof v === 'number' ) {
			this._max.base = v;
		} else this._max = new Stat(v);

	},

	/**
	 * @property {Action[]} actives - Actively running tasks.
	 */
	actives:[],

	/**
	 * @property {Action[]} waiting - actions waiting to run once rest is complete.
	 */
	waiting:[],

	tryAdd( a ) {

		if ( this.hasType(a) ) return false;
		this.actives.push(a);

		return true;

	},

	addWait( a ){
		this.waiting.push(a);
	},

	actionDone( act ){

		if ( act.hasTag( 't_rest' ) ) {
			// attempt to resume any waiting actions.
			this.tryResume();
		}

	},

	clearWaits() {
		this.waiting.splice(0,this.waiting.length);
	},

	/**
	 * Attempt to resume any waiting actions.
	 */
	tryResume() {

		let avail = this._max.value - this.actives.length;

		for( let i = this.waiting.length; i >= 0; i-- ) {

			var a = this.waiting[a];
			if ( this.hasType(a) ) quickSplice(this.waiting, i);
			else if ( Game.canPay(a) ) {

				if ( --avail === 0 ) return;

			}

		}

		console.log('Action available. Try rest?' );

	},

	/**
	 * Action removed.
	 * @param {Action} a
	 */
	removed(a) {

		if ( this.actives.length === 0 ) {
			this.tryAdd( Game.state.restAction );
		}

	},

	/**
	 * revive data from save.
	 * @param {GameState} gs
	 */
	revive( gs ) {

		this.waiting = gs.toData(this.waiting);
		this.actives = gs.toData(this.actives);

		Events.add( ACT_DONE, this.actionDone, this );

	},

	update(dt) {

		for( let i = this.actives.length-1; i>= 0; i-- ) {

			if ( !this.doAction( this.actives[i], dt ) ) {

				quickSplice( this.actives, i );

			}

		}

	},

	/**
	 * Update individual action.
	 * @param {Action} a
	 * @param {number} dt
	 */
	doAction(a, dt) {

		if ( !a.canUse() ) return false;

		if ( a.run ) {

			if ( !Game.canPay( a.run, dt ) ) {
				this.addWait(a);
				return false;
			}
			Game.payCost( a.run, dt );

		}

		if ( a.fill && Game.filled(a.fill ) ) {

			this.haltAction();

		} else if ( action.update ) {

			a.update(dt);
			if ( a.effect) Game.applyEffect( action.effect, dt );
			a.dirty = true;

		}

	},

	/**
	 * Tests if the runner already has a similar action in progress.
	 * Only actives are tested. Waiting action will not resume if
	 * a new active takes its place.
	 * @param {Action} a
	 */
	hasType( it ) {

		let t = it.type;

		for( let i = this.actives.length-1; i>= 0; i-- ) {

			var a = this.actives[i];
			if ( a.type === t ) return true;

		}

		return false;

	}


}