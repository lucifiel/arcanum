<script>
import Game from '../game';
import ItemBase from './itemsBase.js';

import ProgBar from './progbar.vue';

export default {
	
	props:['state'],
	mixins:[ItemBase],
	data(){
		return {
			game:Game
		};
	},
	components:{
		progbar:ProgBar
	},
	methods:{

	},
	computed:{

		raid() { return this.state.raid; },

		raiding() { return this.state.curAction===this.raid; },

		dungeons(){
			return this.game.filterItems( it=>it.type==='dungeon'&& !this.locked(it) );
		}

	}

}
</script>


<template>

<div class="adventure">

	<div v-if="raiding">
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
			@click="dispatch( 'raid', d, raid.dungeon !== d )"
			@mouseenter.capture.stop="dispatch('itemover', $event, d )">
			{{ raiding && raid.dungeon === d ? 'Stop' : 'Enter' }}</button></td>

	</tr>
	</table>

</div>
	
</template>

<style scoped>


</style>
