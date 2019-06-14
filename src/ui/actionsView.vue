<script>
import { round } from 'format';

import Game from '../game';

export default {
	
	props:['actions'],
	data(){
		return {
		}
	},
	methods:{

		format:round,

		usable(act) {

			return !act.cost || Game.canPay( act.cost );

		},

		locked(act) {

			return (!act) || ( (act.locked === false) ? false : !Game.tryUnlock(act) );
		},

		click( act ){

			this.$emit( 'click', act );

		}

	}

}
</script>


<template>
<div class="action-list">

	<button :class="{'action-button':true, locked:locked(it) }" v-for="it in actions" :key="it.id"
		:disabled="!usable(it)" @click="click(it)">{{ it.name || it.id }}</button>

</div>
</template>