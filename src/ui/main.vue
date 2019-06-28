<script>
import Menu from './menu.vue';
import ResoucesView from './resourcesView.vue';
import ActionsView from './actionsView.vue';
import UpgradesView from './upgradesView.vue';
import HomeView from './homes.vue';

import ProgBar from './progbar.vue';
import SkillsPane from './skillsPane.vue';
import DotView from './dotView.vue';
import ItemPopup from './itemPopup.vue';
import PlayerView from './player.vue';
import LogView from './outlog.vue';
import Adventure from './adventure.vue';

/**
 * @listens [sell,itemover,itemout]
 */
export default {

	/**
	 * @property {Game} game
	 */
	props:['game'],
	components:{
		resources:ResoucesView,
		actions:ActionsView,
		upgrades:UpgradesView,
		itempopup:ItemPopup,
		log:LogView,
		skills:SkillsPane,
		dots:DotView,
		homes:HomeView,
		progbar:ProgBar,
		player:PlayerView,
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

		this.menuItems = ['main', 'skills', 'house', 'adventure', 'player'];

		this.unpause();

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
				this.interval = setInterval( ()=>this.game.update(), 200 );
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

		doRest(){

			if ( !this.resting ) this.gameState.curAction = this.game.getItem('rest');
			else this.game.stopAction( this.game.getItem('rest') );

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

		onUpgrade(upgrade) {
			this.game.tryUpgrade(upgrade);
		},
	
		onAction( action ) {
			this.game.tryAction( action );
		},

		onRaid( dungeon ) {

			this.game.startRaid( dungeon );

		}

	},
	computed:{
		resting() { return this.gameState.curAction === this.game.getItem('rest'); },

		stamina(){
			return this.game.getItem('stamina');
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

		<div class="stamina-bar">
		<progbar label="Stamina" :value="stamina.value" :max="stamina.max.value" />
		<button class="rest-btn" @click="doRest">{{ this.resting ? 'Stop' : 'Rest' }}</button>
		Action: {{ this.gameState.curAction !== null ? this.gameState.curAction.name : 'None'}}
		</div>

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
	
		<template slot="adventure">
			<adventure :state="gameState" />
		</template>

		<template slot="skills">
			<skills :game-data="gameState"></skills>
		</template>

		</vue-menu>

		<log :log="game.log" />

	</div>
</template>