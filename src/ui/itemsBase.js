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
			return Game.canBuy( it );
		},

		locked(it) {
			return (!it) || ( (it.locked === false) ? false : !Game.tryUnlock(it) );
		}

	}

}