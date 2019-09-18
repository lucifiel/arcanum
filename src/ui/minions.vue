<script>
import Game from '../game';

import FilterBox from './components/filterbox.vue';

export default {

	data(){
		return {
			filtered:null
		};
	},
	components:{
		filterbox:FilterBox
	},
	computed:{

		inRaid() { return Game.state.curAction === Game.state.raid },

		minions(){ return Game.state.minions; },

		items(){ return Game.state.minions.filter( v=>v.value>=1 ); },

	},
	methods:{

		toggleActive(b) {
			this.minions.setActive( b, !b.active );
		},

		dismiss(b){
			this.minions.remove(b);
		},

		toNum(v) {
			if ( v === undefined ) return 0;
			return ( (v && typeof v === 'object') ? v.value : v ).toFixed(1);
		}

	}

}
</script>

<template>

<div class="bestiary">

	<filterbox v-model="filtered" :items="items" min-items="10" />

	<span v-if="inRaid" class="warn-text">Cannot change active minions while adventuring</span>
	<div>{{ minions.count + ' / ' + minions.max + ' Used' }}</div>
	<div class="char-list">
	<table class="minions">
		<tr><th>Creature</th><th class="num-align">Hp</th><th>active</th></tr>
		<tr v-for="b in filtered" :key="b.id" @mouseenter.capture.stop="dispatch('itemover',$event,b)">
			<th>{{ b.name }}</th>
			<td class="num-align">{{ toNum(b.hp) }} / {{ toNum( b.maxHp ) }}</td>

			<td v-if="!b.alive">Dead</td>
			<td v-else>
				<button @click="toggleActive(b)" :disabled="inRaid">{{ b.active === true ? 'Rest' : 'Activate' }}</button>
			</td>

			<td><confirm @confirm="dismiss(b)">{{ 'Dismiss'}}</confirm></td>
		</tr>
	</table>
	</div>

</div>

</template>

<style scoped>

.bestiary {
	padding-left:16px;
	height:100%;
}

.char-list {
	height:85%;
	overflow-y:auto;
}

table {
	border-spacing: 4px 0px;
	border-collapse: collapse;
	row-gap: 4px;
	column-gap: 10px;

}

tr:first-child th {
	border-bottom: 1pt solid black;
	margin: 4px 4px;
}

tr > th:first-of-type {
	text-align: left;
}

th {
	padding: 4px 10px;
}

td.num-align {
	padding: 8px;
}

</style>