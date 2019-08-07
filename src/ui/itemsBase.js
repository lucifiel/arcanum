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
			return (it.length || it.perpetual ) ? Game.canRun(it) : Game.canUse( it );
		},

		visible(it) {
			return !it.locked && it.disabled === false;
		},

		reslocked( it ) {
			//return it.disabled === true || it.locks > 0 || it.locked !== false;
			return it.disabled === true || it.locks > 0 || ( it.locked && !Game.tryUnlock(it) );
		},

		locked(it) {

			//return it.disabled === true || it.maxed() || it.locks>0 || it.locked !== false;
			return it.disabled === true || it.maxed() || it.locks>0 || ( it.locked && !Game.tryUnlock(it) );

		}

	}

}