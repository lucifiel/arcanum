<script>
import Game from '../game';
import ItemBase from './itemsBase.js';

import ProgBar from './progbar.vue';

export default {
	
	props:['state'],
	mixins:[ItemBase],
	data(){
		return {

		};
	},
	components:{
		progbar:ProgBar
	},
	methods:{

	},
	computed:{

		dungeons(){
			return Game.filterItems( it=>it.type==='dungeon'&& !this.locked(it) );
		},
		player(){ return this.state.player; },
		game() { return Game; }

	}

}
</script>


<template>

<div class="adventure">

	<table>
	<tr v-for="d in dungeons" :key="d.id">

		<td>{{ d.name }}</td>
		<td><progbar class="dungeon" :value="d.progress" :max="d.length" /></td>
		<td><button class="raid-btn" :disabled="!game.runnable(d)"
			@click="dispatch( 'raid', d )"
			@mouseenter.capture.stop="dispatch('itemover', $event, d )"
			@mouseleave.capture.stop="dispatch('itemout', $event )">Enter</button></td>

	</tr>
	</table>

	<progbar :value="player.hp.value" :max="player.hp.max" label="hp" color="#ee0000" />

</div>
	
</template>

<style scoped>


</style>
