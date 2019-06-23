<script>
import Menu from './menu.vue';
import ResoucesView from './resourcesView.vue';
import ActionsView from './actionsView.vue';
import UpgradesView from './upgradesView.vue';
import HomeView from './homes.vue';

import SkillsPane from './skillsPane.vue';
import DotView from './dotView.vue';
import ItemPopup from './itemPopup.vue';
import PlayerView from './player.vue';
import LogView from './outlog.vue';

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
		'player':PlayerView,
		'vue-menu':Menu
	},
	data(){

		return {
			gameData:this.game.gameData,
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

		this.menuItems = ['main', 'skills', 'home', 'player'];

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
			var events = this.gameData.events;
			for( let p in events ) {

				evt = events[p];
				if ( evt.locked === false ) this.game.doEvent(evt);

			}

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

	}

}
</script>

<template>

	<div class="main">

		<!-- popup -->
		<itempopup :item="overItem" :elm="overElm" />

		<resources :items="gameData.resources"/>
		<dots :dots="gameData.dots" />

		<vue-menu class="mid-view" :items="menuItems" active="main">

		<template slot="main">
		<actions :items="gameData.actions" />
		<upgrades :items="gameData.upgrades" />

		</template>
	
		<template slot="player">
			<player :player="gameData.player" />
		</template>

		<template slot="home">
			<homes :game-data="gameData" />
		</template>
	
		<template slot="skills">
			<skills :game-data="gameData"></skills>
		</template>

		</vue-menu>

		<log :log="game.log" />

	</div>
</template>