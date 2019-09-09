<script>
import Game from '../game';
import ItemBase from './itemsBase.js';

import ProgBar from './components/progbar.vue';
import FilterBox from './components/filterbox.vue';

const MAX_ITEMS = 5;

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
	},
	components:{
		progbar:ProgBar,
		filterbox:FilterBox,
		inv:()=>import( /* webpackChunkName: "inv-ui" */ './inventory.vue')
	},
	computed:{

		combatLog() {
			return this.log.items.filter(
				v=>v.type==='combat' ).slice( -MAX_ITEMS );
		},

		raid() { return this.state.raid; },

		raiding() { return this.state.curAction===this.raid; },

		dungeons(){
			return this.state.filterItems(
				it=>it.type==='dungeon' && !this.locked(it)
			);
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
		<span class="bar"><progbar :value="d.exp" :max="d.length" /></span>
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
				<span class="log-text">{{ it.text || '' }}</span>
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
	padding:0px 15px;
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
