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

		reslocked( it ) {
			return it.disabled === true ||
			( it.locked && !Game.tryUnlock(it) );
		},

		locked(it) {

			return it.disabled === true || it.maxed() ||
			( it.locked&& !Game.tryUnlock(it) );

		}

	}

}