<script>
import Game from '../game';

import Inventory from './inventory.vue';
import FilterBox from './components/filterbox.vue';
import ItemsBase from './itemsBase';

export default {

	mixins:[ItemsBase],
	components:{
		filterbox:FilterBox,
		inv:Inventory
	},
	data() {

		return {
			/**
			 * @property {Item[]} filtered - filtered search results.
			 */
			filtered:null,
			/**
			 * @property {Item} target - current enchant target.
			 */
			target:null
		}
	},
	beforeCreate(){
		this.state = Game.state;
	},
	computed:{

		enchants(){
			return this.state.filterItems( it=>it.type==='enchant' && !this.locked(it) );
		}
	},
	methods:{
	}

}
</script>

<template>

		<div class="enchants">

		<div @mouseenter.capture.stop="dispatch('itemover', $event, target )">
			Target: {{ target ? target.name : 'None' }}
		</div>

		<filterbox v-model="filtered" :items="enchants" min-items="7" />
		<div v-for="it in filtered" :key="it.id">

			{{ it.name }}
			<button :disabled="!target||!it.canApply(target)||!usable(it)"
				@click="dispatch( 'enchant', it, target )">Enchant</button>

		</div>

		<inv selecting=true :inv="state.inventory" v-model="target" />

	</div>

</template>

<style scoped>

</style>}