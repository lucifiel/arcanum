<script>
import Game from '../../game';

export default {

	props:['locale'],
	components:{
	},
	computed:{
		player() { return Game.state.player; }
	}

}
</script>


<template>
<div class='explore'>

	<span class="active-title">
		<span>{{ locale.name }}</span><button class="raid-btn"
		@click="dispatch( 'explore', locale, false )"
		@mouseenter.capture.stop="dispatch('itemover', $event, locale )">Flee</button>
		</span>

		<span class="bar"><progbar :value="locale.exp" :max="locale.length" /></span>


</div>

</template>


<style scoped>


</style>