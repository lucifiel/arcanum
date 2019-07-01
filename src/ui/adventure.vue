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

		raid() { return this.state.raid; },

		dungeons(){
			return Game.filterItems( it=>it.type==='dungeon'&& !this.locked(it) );
		},
		game() { return Game; }

	}

}
</script>


<template>

<div class="adventure">

	<div v-if="state.curAction===raid">
		Adventuring...<br>
		{{ raid.enemy ? raid.enemy.name + ' Encountered' : 'Exploring...' }}<br>
		{{ raid.playerAct }}<br>
		{{ raid.enemyAct }}
	</div>
	<br>

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

</div>
	
</template>

<style scoped>


</style>
