<script>
import Menu from './menu.vue';
import ResoucesView from './resources.vue';
import ActionsView from './actionsView.vue';
import upgrades from './upgrades.vue';
import HomeView from './homes.vue';
import EquipView from './equip.vue';

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
		upgrades:upgrades,
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

		this.listen( 'sell', this.onSell );
		this.listen( 'itemover', this.itemOver );
		this.listen( 'itemout', this.itemOut );
		this.listen( 'upgrade', this.onUpgrade );
		this.listen( 'action', this.onAction );
		this.listen( 'raid', this.onRaid );
		this.listen( 'rest', this.onRest );

		this.listen('home', this.onHome );

		this.listen( 'spell', this.onSpell );
		this.listen( 'learn', this.onLearn );

		// primary attack.
		this.listen( 'primary', this.onPrimary);

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

			var events = this.gameState.events;
			for( let evt of events ) {

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
			else if ( key === 's') this.gameState.fillItem('scrolls');
			else if ( key === 'p') {
				if ( this.gameState.curAction && this.gameState.curAction.length) {
					this.gameState.curAction.progress = this.gameState.curAction.length;
				}
			}

		},

		equip( slot, it ) {
			this.game.equip( slot, it );
		},

		unequip(slot, it){
			this.game.unequip(slot, it)
		},

		drop(it) {
		},

		onSell(it) {
			this.game.trySell( it );
		},

		itemOver(evt, it) {
			this.overItem = it;
			this.overElm = evt.currentTarget;
		},

		itemOut(){

			this.overElm = null;
			this.overItem = null;
		
		},

		onRest(){
			this.game.toggleAction( this.gameState.restAction );
		},

		/**
		 * Attempt to buy new house.
		 */
		onHome(it) {
			this.game.setHome(it);
		},

		onUpgrade(upgrade) {
			this.game.tryItem(upgrade);
		},
	
		onSpell( spell ) {
			this.game.tryItem(spell);
		},

		onAction( action ) {

			if ( action.perpetual || action.length > 0 ) {

			this.game.setAction(action);

			} else this.game.tryItem( action );
		},

		/**
		 * Learn to use a spell or item.
		 * @property {Item} item - item to learn.
		 */
		onLearn(item) {
			this.game.tryLearn(item);
		},

		onRaid( dungeon ) {

			this.game.startRaid( dungeon );

		},

		onPrimary( s) {
			this.gameState.player.setPrimary(s);
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

	<div class="full"
		@mouseover.capture.stop="dispatch('itemout')">

		<div class="top-bar">
			<dots :dots="gameState.dots" />
		</div>
		<div class="main">

		<!-- popup -->
		<itempopup :item="overItem" :elm="overElm" />

		<resources :items="gameState.resources"/>

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

	</div>
</template>

<style scoped>

div.full {
	display:flex;
	flex-direction: column;
	flex-grow: 0;
	width: 100%;
	margin: 0px;
}

div.top-bar {
	display:flex;
	min-height: 24px;
	width:100%;
}

div.main {
	display:flex;
	flex-direction: row;
}

div.mid-view {
	flex-basis:35%;
	margin: 12px 8px;
}

</style>