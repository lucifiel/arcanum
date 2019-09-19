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


		<div v-if="raiding">

		<div class="active-dungeon" v-if="raiding">
			<span>{{ cur.name }}</span>
			<span class="bar"><progbar :value="cur.exp" :max="cur.length" /></span>
			<span><button class="raid-btn"
				@click="dispatch( 'raid', cur, false )"
				@mouseenter.capture.stop="dispatch('itemover', $event, cur )">
				Stop</button></span>
		</div>

			<combat class="combat" v-if="raiding" :combat="raid.combat" />

		</div>


		<!--<filterbox v-model="filtered" :items="dungeons" min-items="8" />-->

		<div class="dungeons" v-else>
		<div class="dungeon" v-for="d in dungeons" :key="d.id">

			<span>
			<span>{{ d.name }}</span>

			<span><button class="raid-btn" :disabled="!game.canRun(d)"
				@click="dispatch( 'raid', d, true )"
				@mouseenter.capture.stop="dispatch('itemover', $event, d )">
				Enter</button></span>
				</span>

			<span class="bar"><progbar :value="d.exp" :max="d.length" /></span>

			</div>
		</div>

	<div class="raid-bottom">

		<inv class="inv" :inv="raid.drops" take="true" />
		<div class="log">
			<span v-if="raiding">Adventuring...<br></span>
			<div class="outlog">
			<div v-for="(it,i) in combatLog" :key="i">
				<span class="log-text">{{ it.text || '' }}</span>
			</div>
			</div>
		</div>

	</div>

</div>

</template>

<style scoped>

.combat {
	overflow-y: auto;
}

.separate {
	margin-bottom: 14px;
	min-height:160px;
}

div.adventure {
	display:flex;
	padding:0px 15px;
	align-self: flex-start;
	flex-flow: column nowrap;
	height:100%;
}

div.dungeons {
	display:flex;
	align-items:flex-start;
	flex-grow:2;
	flex-flow: row wrap;
	justify-content: space-between;
	overflow-y: auto;
	min-height: 55%;
	padding-bottom: 32px;
	border-bottom: 1px solid var(--separator-color);

}

div.raid-bottom {
	display:flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	padding-top:8px;
	width:100%;
	flex-shrink: 1;
	overflow-y:auto;
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

div.dungeon {
	display:flex;
	flex-basis: 40%;
	flex-flow: column nowrap;
}

.bar {
	align-self: stretch;
}
</style>
