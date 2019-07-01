<script>
import Menu from './menu.vue';
import ResoucesView from './resources.vue';
import ActionsView from './actionsView.vue';
import UpgradesView from './upgradesView.vue';
import HomeView from './homes.vue';

import ItemsBase from './itemsBase';

import Vitals from 'ui/vitals.vue';
import SkillsPane from './skillsPane.vue';
import Spellbook from 'ui/spellbook.vue';
import DotView from './dotView.vue';
import ItemPopup from './itemPopup.vue';
import PlayerView from './player.vue';
import LogView from './outlog.vue';
import Adventure from './adventure.vue';

import { TICK_TIME } from '../game';

/**
 * @listens [sell,itemover,itemout]
 */
export default {

	/**
	 * @property {Game} game
	 */
	props:['game'],
	mixins:[ItemsBase],
	components:{
		resources:ResoucesView,
		actions:ActionsView,
		upgrades:UpgradesView,
		itempopup:ItemPopup,
		vitals:Vitals,
		log:LogView,
		skills:SkillsPane,
		dots:DotView,
		homes:HomeView,
		player:PlayerView,
		spellbook:Spellbook,
		adventure:Adventure,
		'vue-menu':Menu
	},
	data(){

		return {
			gameState:this.game.state,
			overItem:null,
			overElm:null
		};


	},
	created(){

		this.listen('sell', this.onSell );
		this.listen( 'itemover', this.itemOver );
		this.listen( 'itemout', this.itemOut );
		this.listen( 'upgrade', this.onUpgrade );
		this.listen( 'action', this.onAction );
		this.listen( 'raid', this.onRaid );
		this.listen( 'rest', this.onRest );

		window.addEventListener('keydown',evt=>this.keyDown( evt.key ), this );

		this.unpause();

		// game events.
		this.initEvents();

	},
	methods:{

		load() {
		},
		save() {
		},
		pause() {
			
			if ( this.interval ) {
				let int = this.interval;
				this.interval = null;
				clearInterval( int );
			}

		},
		unpause() {

			if ( !this.interval ) {
				this.game.lastUpdate = Date.now();
				this.interval = setInterval( ()=>this.game.update(), TICK_TIME );
			}

		},

		initEvents(){

			var evt;
			var events = this.gameState.events;
			for( let p in events ) {

				evt = events[p];
				if ( evt.locked === false ) this.game.doEvent(evt);

			}

		},

		keyDown( key ){
	
			key = key.toLowerCase();
			//console.log('key:' + key);
			if ( key === 'g') this.gameState.fillItem('gold');
			else if ( key === 'r') this.gameState.fillItem('research');
			else if ( key === 'm') this.gameState.fillItem('mana');
			else if ( key === 'a') this.gameState.fillItem('arcana');

		},

		onSell(it) {
			this.game.trySell( it );
		},

		itemOver(evt, it) {
			this.overItem = it;
			this.overElm = evt.currentTarget;
		},

		itemOut(evt ){
			if ( this.overElm===evt.currentTarget) {
				this.overElm = null;
				this.overItem = null;
			}
		},

		onRest(){

			let rest = this.gameState.getItem('rest');
			if ( this.gameState.curAction !== rest ) {

				this.gameState.curAction = rest;
	
			} else this.game.stopAction( rest );

		},

		onUpgrade(upgrade) {
			this.game.tryItem(upgrade);
		},
	
		onAction( action ) {
			this.game.tryItem( action );
		},

		onRaid( dungeon ) {

			this.game.startRaid( dungeon );

		}

	},
	computed:{

		menuItems(){
			return this.gameState.sections.filter( it=>!this.locked(it) );
		}

	}

}
</script>

<template>

	<div class="main">

		<!-- popup -->
		<itempopup :item="overItem" :elm="overElm" />

		<resources :items="gameState.resources"/>
		<dots :dots="gameState.dots" />

		<vue-menu class="mid-view" :items="menuItems" active="main">

		<template slot="main">
		<actions :items="gameState.actions" />
		<upgrades :items="gameState.upgrades" />

		</template>
	
		<template slot="player">
			<player :player="gameState.player" />
		</template>

		<template slot="house">
			<homes :game-data="gameState" />
		</template>
	
		<template slot="raid">
			<adventure :state="gameState" />
		</template>

		<template slot="skills">
			<skills :game-data="gameState"></skills>
		</template>

		<template slot="spells">
			<spellbook :state="gameState" />
		</template>

		</vue-menu>

		<vitals :player="gameState.player" :state="gameState" />
		<log :log="game.log" />

	</div>
</template>

<style scoped>

.mid-view {
	flex-basis:35%;
	margin: 12px 8px;
}

</style>