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
		inv:()=>import('./inventory.vue'),
		filterbox:FilterBox
	},
	beforeCreate(){
		this.game = Game
	},
	methods:{
	},
	computed:{

		potions(){ return Game.state.potions.filter(v=>!this.locked(v)); }

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

			<button v-else :disabled="!usable(it)"
				@click="dispatch( 'brew', it )">Brew</button>

		</div>
		</div>

		</div>

</div>
</template>


<style scoped>

div.potions {
	padding: 0px 16px;
	height:100%;
	overflow-y:auto;
}

</style>