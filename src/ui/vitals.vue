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
		<td><progbar class="stamina" :value="stamina.value" :max="stamina.max.value"
			@mouseenter.native.capture.stop="dispatch('itemover',$event,stamina)"
			@mouseleave.native.capture.stop="dispatch('itemout',$event)"/></td></tr>
		
		<tr><td>hp</td>
		<td><progbar class="hp" :value="player.hp.value" :max="player.hp.max"
			@mouseenter.native.capture.stop="dispatch('itemover',$event,player.hp)"
			@mouseleave.native.capture.stop="dispatch('itemout',$event)"/></td></tr>

		<tr v-for="it in manaList" :key="it.key"><td>{{it.name}}</td>
		<td><progbar :value="it.value" :class="it.id" :max="it.max"
			@mouseenter.native.capture.stop="dispatch('itemover',$event,it)"
			@mouseleave.native.capture.stop="dispatch('itemout',$event)"/></td></tr>

		<tr><td><button class="rest-btn" @click="dispatch('rest')"
			@mouseenter.capture.stop="dispatch('itemover',$event,rest)"
			@mouseleave.capture.stop="dispatch('itemout',$event)">
			{{ this.resting ? 'Stop' : 'Rest' }}</button></td>
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
