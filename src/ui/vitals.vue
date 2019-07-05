<script>
import ProgBar from 'ui/progbar.vue';
import Game from '../game';
import ItemBase from './itemsBase';

/**
 * Player vital bars.
 */
export default {

	props:['state','player'],
	mixins:[ItemBase],
	components:{
		progbar:ProgBar
	},
	computed:{

		manaList() { return this.state.filterItems( it=>it.hasTag('manas') && !it.locked)},
		rest() { return this.state.getItem('rest')},
		resting() { return this.state.curAction === this.rest; },
		stamina(){ return this.state.getItem('stamina'); }
	}

}
</script>

<template>
	<div class="vitals">
		<table>
		
		<tr><td>stamina</td>
		<td><progbar class="stamina" :value="stamina.value" :max="stamina.max.value" /></td></tr>
		
		<tr><td>hp</td>
		<td><progbar class="hp" :value="player.hp.value" :max="player.hp.max" /></td></tr>

		<tr v-for="it in manaList" :key="it.key"><td>{{it.name}}</td>
		<td><progbar :value="it.value" :class="it.id" :max="it.max" /></td></tr>

		<tr><td><button class="rest-btn" @click="dispatch('rest')">{{ this.resting ? 'Stop' : 'Rest' }}</button></td>
			<td>{{ this.state.curAction !== null ? (this.state.curAction.verb || this.state.curAction.name) : ''}}</td></tr>

		</table>

		<br>

	</div>
</template>

<style scoped>

div.vitals {
	margin:4px 10px;
}

</style>
