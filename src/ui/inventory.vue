<script>
import Game from '../game';
import FilterBox from './component/filterbox.vue';

export default {

	/**
	 * @property {Inventory} inv - the inventory object.
	 * @property {boolean} take - whether to display take button.
	 */
	props:['inv', 'take'],
	data() {
		return {
			filtered:null
		}
	},
	methods:{

		drop( it ){
			this.inv.remove(it);
		},

		onTake(it) {

			console.log('start take: ' + it.id );
			this.dispatch('take', it );
			this.inv.remove(it);

		}

	},
	computed:{
		playerFull(){
			return Game.state.inventory.full();
		}
	},
	components:{
		filterbox:FilterBox
	}

}
</script>


<template>
<div>
	<filterbox v-model="filtered" :items="inv.items" min-items="10" />
<table class="inv item-table">
	<tr v-for="it in filtered" :key="it.id">
		<td @mouseenter.capture.stop="dispatch('itemover',$event,it)">{{ it.name }}</td>
		<td><button @click="dispatch('equip',it, inv)">Equip</button></td>
		<td v-if="take&&!playerFull"><button @click="onTake(it)">Take</button></td>
		<td><button @click="drop(it)">Drop</button></td>
	</tr>
</table>
<div v-if="playerFull" class="warn-text">Player inventory full</div>
</div>
</template>


<style scoped>

.inv {
	margin-left: 48px;
	width:auto;
	height:auto;
}


</style>