<script>
import Game from '../game';

import ItemsBase from './itemsBase';
import UpgradeView from './upgrades.vue';

/**
 * @emits sell
 */
export default {

	props:['state'],
	mixins:[ItemsBase],
	components:{
		'upgrades':UpgradeView
	},
	data(){

		return {
			/**
			 * @property {boolean} switching - true when switching homes.
			 */
			switching:false
		}

	},
	methods:{
		toggleSwitch(){
			this.switching = !this.switching;
		}
	},
	computed:{

		homesAvail() {
			return this.state.homes.filter( v=>!this.locked(v) );
		},

		furniture(){
			return Game.filterItems( it=>this.state.typeCost(it.cost, 'space')>0);
		},
		viewable(){
			return this.furniture.filter( it=>!this.reslocked(it));
		}

	}

}
</script>

<template>

	<div class="home-view">

		<div>

			<span>home: {{ state.curHome ? state.curHome.name : 'None'}}</span>
			<div v-if="homesAvail.length>0">
			<button @click="toggleSwitch">{{ switching ? 'Done' : 'Switch' }}</button>
			<upgrades v-if="switching" class="homes-view" :items="homesAvail" pick-event="home" />
			</div>

		</div>

		<div class="furniture">

		<table class="furniture item-table">
			<tr><th class="space">Space</th><th class="name">Furnishing</th><th class="count">Count</th></tr>
		<tr v-for="it in viewable" :key="it.id">

			<td class="space">{{ it.cost.space }}</td>
			<td class="name">{{ it.name }}</td> <td class="count">{{ it.value || 0 }}</td>
			<td><button type="button" :disabled="!usable(it)" class="buy-btn"
				@mouseenter.capture.stop="dispatch('itemover', $event, it )"
				@click="dispatch('action',it)">Buy</button></td>

			<td><button type="button" :disabled="!it.value || it.value<=0" class="sell-btn" @click="dispatch('sell',it)">Sell</button></td>

		</tr>
		</table>

		</div>

	</div>

</template>

<style scoped>

div.home-view {
	height:100%;
}

.furniture {
	display:flex;
	overflow-y:auto;
	flex-direction: column;
	width:100%;
	height:93vh;
}

table .count, table .space {
	text-align: center;
}
table .name {
	padding: 0px 8px 0px 12px;
	min-width:120px;
	text-align: left;
}
</style>
