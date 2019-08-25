<script>
import Game from '../game';

import FilterBox from './component/filterbox.vue';

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

		animals() { return Game.state.getItem('animals');},

		lore() { return Game.state.getItem('lore');},

		demonology() { return Game.state.getItem('demonology');},

		items(){
			return Game.state.monsters.filter( v=>v.value>=1 );
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
		<tr><th>Creature</th><th>Owned</th><th class="number">Hp</th></tr>
		<tr v-for="b in filtered" :key="b.id">
			<th @mouseenter.capture.stop="dispatch('itemover',$event,b)">{{ b.name }}</th>
			<td class="number">{{ b.value }}</td>
			<td class="number">{{ toNum(b.hp) }}</td>
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

th.number {
	text-align: right;
}

td.number {
	padding: 8px;
	text-align: right;
}

</style>