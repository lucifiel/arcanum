<script>
import { round } from 'format';

import Game from '../game';

export default {
	
	props:['actions'],
	data(){
		console.log('this.actions: ' + this.actions );
		return {
		}
	},
	methods:{

		format:round,

		usable(act) {

			if ( act.cost ) return Game.canPay( act.cost );

		},

		click( act ){

			this.$emit( 'click', act );

		}

	}

}
</script>


<template>
<div class="action-list">

	<button class="action-button" v-for="it in actions" :key="it.id"
		:disabled="!usable(it)" @click="click(it)">{{ it.name || it.id }}</button>

</div>
</template>