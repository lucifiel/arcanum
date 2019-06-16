<script>
import Game from '../game';
import { round } from 'format';

export default {
	
	props:['items', 'layout'],
	data(){

		this.pLayout = this.layout || 'upgrade-list';
		console.log('this.items: ' + this.items );
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
<div :class="{[layout]:true}">

	<button :class="{'action-btn':true, locked:locked(it) }" v-for="it in items" :key="it.id"
		:disabled="!usable(it)" @click="click(it)">{{ it.name || it.id }}</button>

</div>
</template>