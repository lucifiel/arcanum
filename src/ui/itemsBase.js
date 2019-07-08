/**
 * Base view for all item lists.
 */
import { round } from 'format';

import Game from '../game';

export default {
	
	props:['items'],
	methods:{

		round:round,

		usable(it) {
			return Game.canUse( it );
		},

		visible(it) {
			return !it.locked && it.disabled === false;
		},

		/**
		 * Note: Multi-lock means a tryUnlock() test should be done only
		 * when a single lock remains.
		 * @param {*} it 
		 */
		reslocked( it ) {
			return it.disabled === true ||
			( it.locked > 1 || !Game.tryUnlock(it) );
		},

		locked(it) {

			return it.disabled === true || it.maxed() ||
			( it.locked >= 1 || !Game.tryUnlock(it) );

		}

	}

}