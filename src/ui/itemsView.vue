<script>
/**
 * Base view for all item lists.
 */

import { round } from 'format';

import Game from '../game';

export default {
	
	props:['items', 'layout', 'item-class'],
	data(){
		return {
		}
	},
	methods:{

		round:round,

		usable(it) {

			return !it.cost || Game.canPay( it.cost );

		},

		locked(it) {

			return (!it) || ( (it.locked === false) ? false : !Game.tryUnlock(it) );
		},

		click( it ){
			this.$emit( 'click', it );
		}

	}

}
</script>


<template>
<div :class="layout">

	<button :class="{'action-button':true, locked:locked(it) }" v-for="it in actions" :key="it.id"
		:disabled="!usable(it)" @click="click(it)">{{ it.name || it.id }}</button>

</div>
</template>