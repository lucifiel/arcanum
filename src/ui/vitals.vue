<script>
import ProgBar from 'ui/components/progbar.vue';
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

		focus() { return this.state.getData('focus'); },
		manaList() { return this.state.filterItems( it=>it.hasTag('manas') && !it.locked)},
		resting() { return this.state.curAction === this.state.restAction; },
		stamina(){ return this.state.getData('stamina'); }
	}

}
</script>

<template>

	<div class="vitals">
		<!-- anything not a table is a headache -->
		<div class="bars">

		<tr><td><button class="btn-sm" @click="dispatch('rest')"
			@mouseenter.capture.stop="dispatch('itemover',$event, state.restAction )">
			{{ this.resting ? 'Stop' : 'Rest' }}</button></td>
			<td class="separate">{{ actionStr() }}

			<button class="btn-sm" @mouseenter.capture.stop="dispatch('itemover',$event, focus )"
				v-if="usable(focus)"
				@click="dispatch('action', focus)">Focus</button></td></tr>

		<tr><td>stamina</td>
		<td><progbar class="stamina" :value="stamina.value" :max="stamina.max.value"
			@mouseenter.capture.stop.native="dispatch('itemover',$event,stamina)"/></td></tr>

		<tr><td>hp</td>
		<td><progbar class="hp" :value="player.hp.value" :max="player.hp.max.value"
			@mouseenter.capture.stop.native="dispatch('itemover',$event,player.hp)"/></td></tr>

		<tr v-for="it in manaList" :key="it.key"><td>{{it.name}}</td>
		<td><progbar :value="it.value" :class="it.id" :max="it.max.value"
			@mouseenter.native.capture.stop="dispatch('itemover',$event,it)"/></td></tr>

		</div>

	</div>
</template>

<style scoped>

div.vitals {
	margin:4px 8px;
	flex-basis: 19%;
	min-width: 200px;
}

div.vitals .bars {
	display:flex;
	flex-flow: column nowrap;
	width: -moz-available;
	width:-webkit-fill-available;
}

tr td:first-child {
	max-width: 33%;
}

tr td:last-child {
	width:100%;
}

</style>
