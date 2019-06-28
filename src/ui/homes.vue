<script>
import Game from '../game';

import ItemsBase from './itemsBase';
import UpgradeView from './upgradesView.vue';

/**
 * @emits sell
 */
export default {

	props:['gameData'],
	mixins:[ItemsBase],
	components:{
		'upgrades':UpgradeView
	},
	methods:{
	},
	computed:{

		furniture(){
			return Game.filterItems( it=>it.typeCost('space')>0);
		},
		viewable(){
			return this.furniture.filter( it=>!it.locked );
		}

	}

}
</script>

<template>

	<div class="home-view">

		<upgrades class="homes-view" :items="gameData.homes" layout="homes-view" />
		
		<div class="furniture">

		<table class="furniture">
			<tr><th class="space">Space</th><th class="name">Furnishing</th><th class="count">Count</th></tr>
		<tr v-for="it in viewable" :key="it.id">

			<td class="space">{{ it.cost.space }}</td> <td class="name">{{ it.name }}</td> <td class="count">{{ it.value || 0 }}</td>
				<td><button :disabled="!it.value || it.value<=0" class="sell-btn" @click="dispatch('sell',it)">Sell</button></td>

		</tr>
		</table>

		</div>

	</div>

</template>

<style scoped>

div.furniture {
	display:flex;
	flex-direction: column;
}

table tr, table th {
	padding: 2px 8px;
}

table .count, table .space {
	text-align: center;
}
table .name {
	padding: 2px 8px;
	min-width:120px;
}
</style>
