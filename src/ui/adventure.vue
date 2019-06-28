<script>
import Game from '../game';

import ProgBar from './progbar.vue';
import DungeonView from './dungeon.vue';

export default {
	
	props:['state'],
	data(){
		return {

		};
	},
	components:{
		dungeon:DungeonView,
		progbar:ProgBar
	},
	methods:{

	},
	computed:{

		dungeons(){
			return Game.filterItems( it=>it.type==='dungeon');
		},
		player(){ return this.state.player; }

	}

}
</script>


<template>

<div class="adventure">

	<dungeon v-for="d in dungeons" :key="d.id" :dungeon="d" />

	<progbar :value="player.hp.value" :max="player.hp.max" label="hp" color="#ee0000" />

</div>
	
</template>

<style scoped>


</style>
