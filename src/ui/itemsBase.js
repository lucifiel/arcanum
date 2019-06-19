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
		},

		mouseover( e, it) {
			this.$emit( 'itemover', e.currentTarget, it );
		},

		mouseout(e) {
			this.$emit( 'itemout', e.currentTarget)
		},

		click( it ){
			this.$emit( 'click', it );
		}

	}

}