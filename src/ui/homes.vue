<script>
import Game from '../game';

import ItemsBase from './itemsBase';
import UpgradeView from './upgradesView.vue';

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

		<upgrades class="homes-view" :items="gameData.homes"
			@itemover="itemover" @itemout="itemout" layout="homes-view" @click="onUpgrade" />
		
		<div class="furnishings">

		<div v-for="it in furniture" :key="it.id">
			<span v-if="!it.locked&&it.value>0">
			{{ it.cost.space }} {{ it.name }} <button class="sell-btn" @click="sell(it)">Sell</button>
			</span>
		</div>

		</div>

	</div>

</template>
