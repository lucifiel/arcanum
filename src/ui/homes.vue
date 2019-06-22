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

		sell(it){

		},

		onUpgrade(upgrade) {
			Game.tryUpgrade(upgrade);
		}

	},
	computed:{

		furniture(){
			return Game.filterItems( it=>it.typeCost('space')>0);
		}

	}

}
</script>


<template>

	<div class="home-view">

		<upgrades class="homes-view" :items="gameData.homes" layout="homes-view" />
		
		<div class="furnishings">

		<table>
		<tr v-for="it in furniture" :key="it.id">
			<span v-if="!it.locked&&it.value>0">
			<td>{{ it.cost.space }}</td> <td>{{ it.name }}</td> <td>{{ it.value }}</td>
				<td><button class="sell-btn" @click="dispatch('sell',it)">Sell</button></td>
			</span>
		</tr>
		</table>

		</div>

	</div>

</template>
