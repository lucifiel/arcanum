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
			return Game.canUse( it );
		},

		visible(it) {
			return it.locked === false && it.disabled === false;
		},

		reslocked( it ) {
			return it.disabled === true ||
			( it.locked===true && !Game.tryUnlock(it) );
		},

		locked(it) {

			return it.disabled === true || it.maxed() ||
			( it.locked===true && !Game.tryUnlock(it) );

		}

	}

}