/**
 * Base view for all item lists.
 */
import { floor } from 'format';

import Game from '../game';

export default {
	
	props:['items'],
	methods:{

		floor:floor,

		showName(it) {
			return it.actname || it.name || it.id;
		},

		usable(it) {
			return (it.length || it.perpetual ) ? Game.canRun(it) : Game.canUse( it );
		},

		visible(it) {
			return !it.locked && it.disabled === false;
		},

		buyable(it) { return Game.canBuy(it)},

		reslocked( it ) {
			return it.disabled === true || it.locks > 0 || it.locked !== false;
		},

		locked(it) {

			return it.disabled === true || it.maxed() || it.locks>0 || it.locked !== false;

		}

	}

}