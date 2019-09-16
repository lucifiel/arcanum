<script>
import Game from '../game';
import ItemBase from './itemsBase.js';

import ProgBar from './components/progbar.vue';
import FilterBox from './components/filterbox.vue';
import Combat from './items/combat.vue';

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
		combat:Combat,
		progbar:ProgBar,
		filterbox:FilterBox,
		inv:()=>import( /* webpackChunkName: "inv-ui" */ './inventory.vue')
	},
	computed:{

		combatLog() {
			return this.log.items.filter(
				v=>v.type==='combat' ).slice( -MAX_ITEMS );
		},

		cur() { return this.state.raid.dungeon },

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

		<div class="separate">

		<div class="active-dungeon" v-if="raiding">
			<span>{{ cur.name }}</span>
			<span class="bar"><progbar :value="cur.exp" :max="cur.length" /></span>
			<span><button class="raid-btn"
				@click="dispatch( 'raid', cur, false )"
				@mouseenter.capture.stop="dispatch('itemover', $event, cur )">
				Stop</button></span>
		</div>
		<div class="dungeon-list" v-else>

		<filterbox v-model="filtered" :items="dungeons" min-items="8" />

		<div class="dungeon" v-for="d in filtered" :key="d.id">

			<span>{{ d.name }}</span>
			<span class="bar"><progbar :value="d.exp" :max="d.length" /></span>
			<span><button class="raid-btn" :disabled="!game.canRun(d)"
				@click="dispatch( 'raid', d, true )"
				@mouseenter.capture.stop="dispatch('itemover', $event, d )">
				Enter</button></span>

			</div>

		</div>

		<div class="log">
			<span v-if="raiding">Adventuring...<br></span>
			<div class="outlog">
			<div v-for="(it,i) in combatLog" :key="i">
				<span class="log-text">{{ it.text || '' }}</span>
			</div>
			</div>
		</div>

		</div>

	<combat v-if="raiding" :combat="raid.combat" />

	<inv :inv="raid.drops" take="true" />

</div>

</template>

<style scoped>

.separate {
	margin-bottom: 14px;
	min-height:160px;
}

div.adventure {
	display:flex;
	padding:0px 15px;
	align-self: flex-start;
	flex-flow: column nowrap;
}

.adventure .log {
	flex-basis:48%;
	flex-grow:1;
	margin: 0px 0px 10px 20px;
}

.active-dungeon {
	display:flex;
	flex-basis:40%;
	min-width:222px;
	flex-direction:column;

}

div.dungeon-list {
	display:flex;
	flex-basis:50%;
	min-width:222px;
	flex-direction:column;
}

div.dungeon {
	display:flex;
	flex-basis: 40%;
	justify-content: space-between;
	align-items: center;
	flex-flow: row nowrap;
}

span.bar {
	flex-basis: 55%;
}
</style>
