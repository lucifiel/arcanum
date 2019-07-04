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
			return Game.filterItems( it=>this.gameData.typeCost(it.cost, 'space')>0);
		},
		viewable(){
			return this.furniture.filter( it=>!this.reslocked(it));
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

			<td class="space">{{ it.cost.space }}</td>
			<td class="name">{{ it.name }}</td> <td class="count">{{ it.value || 0 }}</td>
			<td><button :disabled="!usable(it)" class="buy-btn"
				@mouseenter.capture.stop="dispatch('itemover', $event, it )"
				@mouseleave.capture.stop="dispatch('itemout',$event)"
				@click="dispatch('action',it)">Buy</button></td>
			<td><button :disabled="!it.value || it.value<=0" class="sell-btn" @click="dispatch('sell',it)">Sell</button></td>

		</tr>
		</table>

		</div>

	</div>

</template>

<style scoped>

div.home-view {
	height:100%;
}

div.furniture {
	display:flex;
	overflow-y:auto;
	flex-direction: column;
	flex-basis: 100%;
}

table tr, table th {
	padding: 2px 8px;
}

table .count, table .space {
	text-align: center;
}
table .name {
	padding: 2px 8px 2px 12px;
	min-width:120px;
	text-align: left;
}
</style>
