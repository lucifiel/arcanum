<script>
import Game from '../game';
import ItemBase from './itemsBase.js';

import Inv from './inventory.vue';
import ProgBar from './component/progbar.vue';
import FilterBox from './component/filterbox.vue';

export default {
	
	props:['state'],
	mixins:[ItemBase],
	data(){
		return {
			log:Game.log,
			filtered:null
		}
	},
	beforeCreate(){
		this.game = Game;
		this.MAX_ITEMS = 5;
	},
	components:{
		progbar:ProgBar,
		filterbox:FilterBox,
		inv:Inv
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

<div class="adventure">

	<div class="dungeon-list">

		<filterbox v-model="filtered" :items="dungeons" min-items="8" />

	<div class="dungeon" v-for="d in filtered" :key="d.id">

		<span>{{ d.name }}</span>
		<span class="bar"><progbar :value="d.progress" :max="d.length" /></span>
		<span><button class="raid-btn" :disabled="!game.canRun(d)"
			@click="dispatch( 'raid', d, !raiding || (raid.dungeon !== d) )"
			@mouseenter.capture.stop="dispatch('itemover', $event, d )">
			{{ raiding && (raid.dungeon === d) ? 'Stop' : 'Enter' }}</button></span>

	</div>
	</div>

	<div>
		<div class="log">
			<span v-if="raiding">Adventuring...<br></span>
			<div class="outlog">
			<div v-for="(it,i) in combatLog" :key="i">
				<span class="log-text">{{ it.text || 'Nothing' }}</span>
			</div>
			</div>
		</div>

		<inv :inv="raid.drops" take="true" />
	</div>

</div>
	
</template>

<style scoped>

div.adventure {
	display:flex;
	width: 100%;
	align-self: flex-start;
	flex-flow: row nowrap;
	justify-content: space-around;
}

div.log {
	width:100%;
	margin: 0px 0px 10px 10px;
}

div.dungeon-list {
	display:flex;
	width: 55%;
	min-width:222px;
	flex-direction:column;
}

div.dungeon {
	display:flex;
	width:100%;
	justify-content: space-between;
	align-items: center;
	flex-flow: row nowrap;
}

span.bar {
	flex-basis: 55%;
}
</style>
