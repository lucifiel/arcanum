<script>
import Game from '../../game';

import Combat from './combat.vue';
import ProgBar from '../components/progbar.vue';

import {EXIT_LOC} from '../../events';

export default {

	props:['explore'],
	components:{
		combat:Combat,
		progbar:ProgBar
	},
	created(){
		this.EXIT_LOC = EXIT_LOC;
	},
	computed:{

		statuses() { return Game.state.statuses; },

		/**
		 * @property {Player} player
		 */
		player() { return Game.state.player; },

		/**
		 * @property {string} type - locale type
		 */
		type() { return this.explore.type; },

		/**
		 * @property {Encounter} enc - current encounter.
		 */
		enc() { return this.explore.enc; }

	}

}
</script>


<template>
<div class='explore'>

	<span class="active-title">
		<span>{{ explore.name }}</span><button class="raid-btn"
		@click="dispatch( EXIT_LOC, explore.locale, false )"
		@mouseenter.capture.stop="dispatch('itemover', $event, explore.locale )">Flee</button>
		</span>

		<span class="bar"><progbar :value="explore.exp" :max="explore.length" /></span>

		<template v-if="type==='raid'">
			<combat class="combat" :combat="explore.combat" />
		</template>
		<template v-else>

			<div v-if="enc" @mouseenter.capture.stop="dispatch('itemover', $event, enc )">
			<span>{{ enc.name }}</span>
			<progbar :value="enc.exp" :max="enc.length" />
			</div>

			<!--<progbar v-for="s in statuses" :key="s.id" :value="s.value" :max="s.max.value" />-->

		</template>

</div>

</template>


<style scoped>

div.explore .active-title {
	display:flex;
	min-width: 400px;
}

div.explore .active-title > span {
	margin-right:16px;
}


.combat {
	overflow-y: auto;
}

</style>