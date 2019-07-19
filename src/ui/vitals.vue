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
	methods: {

		actionStr(){
			let act = this.state.curAction;
			if ( act === null) return '';

			return (act.verb || act.name) +
				( ( act.length ) ? ' ' + act.percent().toFixed(0) + '%': '' );
		}

	},
	computed:{

		manaList() { return this.state.filterItems( it=>it.hasTag('manas') && !it.locked)},
		resting() { return this.state.curAction === this.state.restAction; },
		stamina(){ return this.state.getItem('stamina'); }
	}

}
</script>

<template>
	<div class="vitals">
		<table>
		
		<tr><td><button class="rest-btn" @click="dispatch('rest')"
			@mouseenter.capture.stop="dispatch('itemover',$event, state.restAction )">
			{{ this.resting ? 'Stop' : 'Rest' }}</button></td>
			<td>{{ actionStr() }}</td></tr>

		<tr><td>stamina</td>
		<td><progbar class="stamina" :value="stamina.value" :max="stamina.max.value"
			@mouseenter.capture.stop.native="dispatch('itemover',$event,stamina)"/></td></tr>
		
		<tr><td>hp</td>
		<td><progbar class="hp" :value="player.hp.value" :max="player.hp.max"
			@mouseenter.capture.stop.native="dispatch('itemover',$event,player.hp)"/></td></tr>

		<tr v-for="it in manaList" :key="it.key"><td>{{it.name}}</td>
		<td><progbar :value="it.value" :class="it.id" :max="it.max"
			@mouseenter.native.capture.stop="dispatch('itemover',$event,it)"/></td></tr>

		</table>

		<br>

	</div>
</template>

<style scoped>

div.vitals {
	margin:4px 10px;
}

</style>
