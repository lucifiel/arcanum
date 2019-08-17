<script>
import Game from '../game';
import ItemBase from './itemsBase.js';

import ProgBar from './progbar.vue';

export default {
	
	props:['state'],
	mixins:[ItemBase],
	data(){
		return {
			log:Game.log
		}
	},
	beforeCreate(){
		this.game = Game;
		this.MAX_ITEMS = 5;
	},
	components:{
		progbar:ProgBar
	},
	computed:{

		combatLog() {
			return this.log.items.filter(
				v=>v.type==='combat' ).slice( -this.MAX_ITEMS );
		},

		raid() { return this.state.raid; },

		raiding() { return this.state.curAction===this.raid; },

		dungeons(){
			return this.game.filterItems( it=>it.type==='dungeon'&& !this.locked(it) );
		}

	}

}
</script>


<template>

<div class="skills">

	<div>
		<span v-if="raiding">Adventuring...<br></span>
		<div class="outlog">
		<div v-for="(it,i) in combatLog" :key="i">
			<span class="log-text">{{ it.text || 'Nothing' }}</span>
		</div>
		</div>
	</div>

	<div class="list">
	<div class="dungeon" v-for="d in dungeons" :key="d.id">

		<span>{{ d.name }}</span>
		<span class="bar"><progbar :value="d.progress" :max="d.length" /></span>
		<span><button class="raid-btn" :disabled="!game.canRun(d)"
			@click="dispatch( 'raid', d, !raiding || (raid.dungeon !== d) )"
			@mouseenter.capture.stop="dispatch('itemover', $event, d )">
			{{ raiding && (raid.dungeon === d) ? 'Stop' : 'Enter' }}</button></span>

	</div>
	</div>

</div>
	
</template>

<style scoped>

div.list {
	display:flex;
	width:100%;
	flex-flow: column wrap;
}

div.dungeon {
	display:flex;
	width:50%;
	justify-content: space-between;
	align-items: center;
	flex-flow: row nowrap;
}

span.bar {
	flex-basis: 55%;
}
</style>
