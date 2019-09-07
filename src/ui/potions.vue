<script>
import Game from '../game';

import FilterBox from './components/filterbox.vue';
import ItemsBase from './itemsBase';

export default {

	mixins:[ItemsBase],
	data(){

		return {
			/**
			 * @property {Item[]} filtered - filtered search results.
			 */
			filtered:null
		}
	},

	components:{
		inv:()=>import('./inventory.vue')
	},
	beforeCreate(){
		this.game = Game
	},
	methods:{
	},
	computed:{

		potions(){ return []; }

	}

}
</script>

<template>
<div class="potions">

		<filterbox v-model="filtered" :items="potions" min-items="7" />

		<div class="flex-row separate">

		<div class="flex-col">
		<div v-for="it in filtered" :key="it.id" @mouseenter.capture.stop="dispatch( 'itemover', $event,it)">

			{{ it.name }}

			<button v-if="it.buy&&!it.owned" :disabled="!buyable(it)"
				@click="dispatch('buy', it)">Unlock</button>

			<button v-else :disabled="!target||!it.canApply(target)||!usable(it)"
				@click="dispatch( 'brew', it, target )">Brew</button>

		</div>
		</div>

		<inv selecting=true :inv="state.inventory" v-model="target" />
		</div>

</div>
</template>


<style scoped>

</style>