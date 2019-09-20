import Game from '../game';
import {quickSplice} from '../util/util';
import Events, {ACTION_DONE, ACT_CHANGED} from '../events';

/**
 * Tracks running/perpetual actions.
 */
export default {

	/**
	 * List of actively running.
	 */
	actives:[],

	tryAdd() {
	},

	actionDone( act ){
	},

	/**
	 * revive data from save.
	 * @param {GameState} state
	 */
	revive( state ) {
	},

	update(dt) {

		for( let i = this.actives.length-1; i>= 0; i-- ) {

			var a = this.actives[i];

		}

	},

	/**
	 * Tests if the runner already has a similar action in progress.
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