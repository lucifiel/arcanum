<script>
import ProgBar from 'ui/progbar.vue';
import Game from '../game';

/**
 * Player vital bars.
 */
export default {

	props:['state','player'],
	components:{
		progbar:ProgBar
	},
	computed:{

		rest() { return this.state.getItem('rest')},
		resting() { return this.state.curAction === this.rest; },
		stamina(){ return this.state.getItem('stamina'); },
	}

}
</script>

<template>
	<div class="vitals">
		<table>
		
		<tr><td>stamina</td>
		<td><progbar :value="stamina.value" :max="stamina.max.value" /></td></tr>
		
		<tr><td>hp</td>
		<td><progbar :value="player.hp.value" :max="player.hp.max" color="#ee0000" /></td></tr>

		<tr><td><button class="rest-btn" @click="dispatch('rest')">{{ this.resting ? 'Stop' : 'Rest' }}</button></td>
			<td>{{ this.state.curAction !== null ? (this.state.curAction.verb || this.state.curAction.name) : ''}}</td></tr>

		</table>

		<br>

	</div>
</template>

<style scoped>


</style>
