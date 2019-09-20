import Game from '../game';
import {quickSplice} from '../util/util';
import Events, {ACT_DONE, ACT_CHANGED} from '../events';
import Stat from '../stat';

const REST_TAG = 't_rest';

/**
 * Tracks running/perpetual actions.
 */
export default {

	toJSON() {

		return {
			max:this.max,
			waiting:waiting.map(v=> v instanceof Runnable ? v : v.id),
			actives:actives.map(v=> v instanceof Runnable ? v : v.id)
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
	actives:null,

	/**
	 * @property {Action[]} waiting - actions waiting to run once rest is complete.
	 */
	waiting:null,

		/**
	 * revive data from save.
	 * @param {GameState} gs
	 */
	revive( gs ) {

		let running = gs.getData('runner');

		if ( running ) {

			this.max = running.max;

			this.waiting = running.waiting;
			this.actives = running.actives;

		}

		if ( !this._max ) this.max = 1;

		if ( this.waiting ) this.waiting = this.waiting.map(v=>this.reviveAct(gs,v), this);
		else this.waiting = [];

		if ( this.actives ) this.actives = this.actives.map(v=>this.reviveAct(gs,v), this);
		else this.actives = [];

		/**
		 * @compat
		 */
		let a = gs.getData('curAction');
		if ( a ) this.runAction( this.reviveAct(gs,a) );

		Events.add( ACT_DONE, this.stopAction, this );

	},

	reviveAct( gs, a ) {

		if (!a) return;

		if ( typeof a === 'string' ) a = gs.getData( a);
		else if ( typeof a === 'object') {

			a = new Runnable( a );
			if ( typeof a.revive === 'function' ) a.revive(gs);

		}
		if ( a.type === 'dungone') return gs.raid;

		a.running=true;

		return a;

	},

	/**
	 * Toggle running state of action.
	 * @param {Action} a
	 */
	toggleAct( a ) {

		let ind = this.actives.indexOf(a);

		if ( ind >= 0 ) {

			this.stopAction(ind);
			// TRY REST?


		} else {

			this.tryAdd(a);

		}


	},

	/**
	 * Add an action absolutely, removing a running item if necessary.
	 * @param {*} a
	 */
	setAction(a) {

		if ( !this.has(a) ) { Events.dispatch( ACT_CHANGED ); }

		if ( a ) {

			if ( a.cost && (a.exp === 0) ) {
				Game.payCost( a.cost);
			}
			this.runAction(a);

		}

	},

	/**
	 * UNIQUE ACCESS POINT for pushing action active.
	 * @param {*} a
	 */
	runAction(a) {
		a.running=true;
		this.actives.push(a);
	},

	/**
	 * UNIQUE ACCESS POINT for splicing action.
	 * @param {number|Action} i
	 */
	stopAction(i){

		if ( typeof i !== 'number') {
			i = this.actives.indexOf(i);
			if ( i < 0 ) return;
		}

		this.actives[i].running=false;
		this.actives.splice(i,1);

		// attempt to resume any waiting actions.
		this.tryResume();

	},

	/**
	 *
	 * @param {*} a
	 */
	tryAdd( a ) {

		if ( this.hasType(a) ) return false;

		this.runAction(a);

		return true;

	},

	addWait( a ){
		this.waiting.push(a);
	},

	/**
	 * CURRENTLY UNUSED. (stopAction called directly)
	 * @param {*} act
	 */
	actionDone( act ){

		console.log('ACTION DONE');
		this.stopAction(act);

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

	update(dt) {

		for( let i = this.actives.length-1; i>= 0; i-- ) {

			if ( !this.doAction( this.actives[i], dt ) ) {

				this.stopAction( i );

			}

		}

	},

	/**
	 * Force-add a rest action.
	 */
	doRest(){ this.doAction( Game.state.restAction ); },

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
	 * Tests if exact action is running.
	 * @param {Action} a
	 * @returns {boolean}
	 */
	has(a) {
		return this.actives.includes(a);
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