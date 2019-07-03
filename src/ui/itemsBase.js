/**
 * Base view for all item lists.
 */
import { round } from 'format';

import Game from '../game';

export default {
	
	props:['items', 'layout'],
	methods:{

		round:round,

		usable(it) {
			return !it.removed && Game.canBuy( it );
		},

		visible(it) {
			return it.locked === false && it.removed === false;
		},

		reslocked( it ) {
			return it.removed === true ||
			( it.locked===true && !Game.tryUnlock(it) );
		},

		locked(it) {

			return it.removed === true || it.maxed() ||
			( it.locked===true && !Game.tryUnlock(it) );

		}

	}

}