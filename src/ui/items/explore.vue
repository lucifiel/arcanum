<script>
import Game from '../../game';

import Combat from './combat.vue';

export default {

	props:['explore'],
	components:{
		combat:Combat
	},
	computed:{

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