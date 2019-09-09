<script>
import Game from '../game';
import FilterBox from './components/filterbox.vue';

export default {

	/**
	 * @property {Inventory} inv - the inventory object.
	 * @property {boolean} take - whether to display take button.
	 */
	props:['inv', 'take', 'value', 'selecting'],
	data() {
		return {
			filtered:null
		}
	},
	components:{
		filterbox:FilterBox
	},
	methods:{

		count(it) { return it.value > 1 ? ' (' + Math.floor(it.value) + ')': ''; },
		drop( it ){
			this.inv.remove(it);
		},

		onTake(it) {

			//console.log('start take: ' + it.id );
			this.dispatch('take', it );
			this.inv.remove(it);

		}

	},
	computed:{
		playerFull(){
			return Game.state.inventory.full();
		}
	}

}
</script>


<template>
<div>
	<filterbox v-model="filtered" :items="inv.items" min-items="10" />
	<div v-if="inv.max > 0">{{ inv.items.length + ' / ' + inv.max.value + ' Used' }}</div>
<table class="inv item-table">
	<tr v-for="it in filtered" :key="it.id">
		<td @mouseenter.capture.stop="dispatch('itemover',$event,it)">{{ it.name + count(it) }}</td>
		<template v-if="!selecting">
			<td v-if="it.equippable"><button @click="dispatch('equip',it, inv)">Equip</button></td>
			<td v-if="it.use"><button @click="dispatch( 'use', it)">Use</button></td>
			<td v-if="take&&!playerFull"><button @click="onTake(it)">Take</button></td>
			<td><button @click="drop(it)">Drop</button></td>
		</template>
		<template v-else>
			<td><button @click="$emit('input', it)">Select</button></td>
		</template>
	</tr>
</table>
<div v-if="playerFull" class="warn-text">Player inventory full</div>
</div>
</template>


<style scoped>

.inv {
	margin-left: 48px;
	margin-right:12px;
	width:auto;
}


</style>