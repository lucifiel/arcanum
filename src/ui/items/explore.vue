<script>
import Game from '../../game';

import Combat from './combat.vue';
import ProgBar from '../components/progbar.vue';


export default {

	props:['explore'],
	components:{
		combat:Combat,
		progbar:ProgBar
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
		type() { return this.locale.type; },

		/**
		 * @property {Encounter} enc - current encounter.
		 */
		enc() { return this.locale.enc; }

	}

}
</script>


<template>
<div class='explore'>

	<span class="active-title">
		<span>{{ explore.name }}</span><button class="raid-btn"
		@click="dispatch( 'explore', explore, false )"
		@mouseenter.capture.stop="dispatch('itemover', $event, explore.locale )">Flee</button>
		</span>

		<span class="bar"><progbar :value="explore.exp" :max="explore.length" /></span>

		<template v-if="type==='raid'">
			<combat class="combat" :combat="explore.combat" />
		</template>
		<template v-else>

			<div v-if="enc">
			<span>{{ enc.name }}</span>
			<progbar :value="enc.exp" :max="enc.length" />
			</div>

			<progbar v-for="s in statuses" :key="s.id" :value="s.value" :max="s.max.value" />

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