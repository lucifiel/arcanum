import Game from '../game';
import {quickSplice} from '../util/util';
import Events, {ACTION_DONE, ACT_CHANGED} from '../events';

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
	 * @property {Action[]} actives - Actively running tasks.
	 */
	actives:[],

	/**
	 * @property {Action[]} waiting - actions waiting to run once rest is complete.
	 */
	waiting:[],

	tryAdd( a ) {

		if ( this.has(a) ) return false;
		this.actives.push(a);

		return true;

	},

	addWait( a ){
		this.waiting.push(a);
	},

	actionDone( act ){
	},

	/**
	 * Action removed.
	 * @param {Action} a
	 */
	removed(a) {

		if ( this.actives.length === 0 ) Game.doRest();

	},

	/**
	 * revive data from save.
	 * @param {GameState} gs
	 */
	revive( gs ) {
	},

	update(dt) {

		for( let i = this.actives.length-1; i>= 0; i-- ) {

			var a = this.actives[i];

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

			if ( !this.canPay( a.run, dt ) ) {
				//console.log('CANT PAY: ' + action.id );
				this.doRest( true )
				return;
			}
			this.payCost( a.run, dt );

		}

		if ( a.fill && this.filled(a.fill ) ) {
			this.haltAction();
		} else if ( action.update ) {

			a.update(dt);
			if ( a.effect) this.applyEffect( action.effect, dt );
			a.dirty = true;

		}

	},

	/**
	 * Tests if the runner already has a similar action in progress.
	 * Only actives are tested. Waiting action will not resume if
	 * a new active takes its place.
	 * @param {Action} a
	 */
	has( it ) {

		let t = it.type;

		for( let i = this.actives.length-1; i>= 0; i-- ) {

			var a = this.actives[i];
			if ( a.type === t ) return true;

		}

		return false;

	}


}