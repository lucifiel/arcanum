<script>
import Game from '../game';

import FilterBox from './components/filterbox.vue';

export default {

	data(){
		return {
			filtered:null
		};
	},
	beforeCreate(){
		this.game = Game;
	},
	methods:{

		toNum(v) {
			return ( typeof v === 'object' ? v.value : v ).toFixed(0);
		}

	},
	computed:{

		totalLore() { return this.animals.value + this.lore.value + this.demonology.value; },

		animals() { return Game.state.getData('animals');},

		lore() { return Game.state.getData('lore');},

		demonology() { return Game.state.getData('demonology');},

		items(){
			return Game.state.minions.filter( v=>v.value>=1 );
		},

		toggleActive(b){

		}

	},
	components:{
		filterbox:FilterBox
	}

}
</script>

<template>

<div>

	<filterbox v-model="filtered" :items="items" min-items="10" />

	<table class="minions">
		<tr><th>Creature</th><th>Owned</th><th class="num-align">Hp</th><th>active</th></tr>
		<tr v-for="b in filtered" :key="b.id" @mouseenter.capture.stop="dispatch('itemover',$event,b)">
			<th>{{ b.name }}</th>
			<td class="num-align">{{ b.value }}</td>
			<td class="num-align">{{ toNum(b.hp) }}</td>
			<td><button @click="toggleActive(b)">{{ b.active ? 'Rest' : 'Activate' }}</button>
			<td><button @click="dismiss(b)">{{ 'Dismiss'}}</button>
		</tr>
	</table>

</div>

</template>

<style scoped>

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