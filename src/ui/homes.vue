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

		curHome() {
			return this.state.getSlot('home');
		},

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

			<span @mouseenter.capture.stop="dispatch('itemover', $event, curHome )">home: {{ curHome ? curHome.name : 'None'}}</span>
			<div v-if="homesAvail.length>0">
			<button @click="toggleSwitch">{{ switching ? 'Done' : 'Switch' }}</button>
			<upgrades v-if="switching" class="homes-view" :items="homesAvail" pick-event="home" />
			</div>

		</div>

		<div class="furniture">

		<div class="warn-text" style="text-align:center" v-if="state.items.space.value===0">No space available. Sell items to free space</div>
		<table class="furniture item-table">
			<tr><th>Space</th><th class="name">Furnishing</th><th>Owned</th><th/><th/></tr>
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
	overflow-y:auto;
	width:100%;
	max-height:90vh;
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
