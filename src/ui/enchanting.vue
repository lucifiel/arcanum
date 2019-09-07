<script>
import Game from '../game';

import FilterBox from './components/filterbox.vue';
import ItemsBase from './itemsBase';

export default {

	mixins:[ItemsBase],
	components:{
		filterbox:FilterBox,
		inv:()=>import( './inventory.vue')
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

		<div class="flex-row separate">

		<div class="flex-col">
		<div v-for="it in filtered" :key="it.id" @mouseenter.capture.stop="dispatch( 'itemover', $event,it)">

			{{ it.name }}

			<button v-if="it.buy&&!it.owned" :disabled="!buyable(it)"
				@click="dispatch('buy', it)">Unlock</button>

			<button v-else :disabled="!target||!it.canApply(target)||!usable(it)"
				@click="dispatch( 'enchant', it, target )">Enchant</button>

		</div>
		</div>

		<inv selecting=true :inv="state.inventory" v-model="target" />
		</div>

	</div>

</template>

<style scoped>

div.enchants {
	display:flex;
	flex-direction: column;
	padding:0px 16px;
}

</style>}