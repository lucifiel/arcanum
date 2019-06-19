<script>
import Menu from './menu.vue';
import ResoucesView from './resourcesView.vue';
import ActionsView from './actionsView.vue';
import UpgradesView from './upgradesView.vue';
import SkillsPane from './skillsPane.vue';

import ItemBox from './itemBox.vue';

import LogView from './outlog.vue';

export default {

	/**
	 * @property {Game} game
	 */
	props:['game'],
	components:{
		resources:ResoucesView,
		actions:ActionsView,
		upgrades:UpgradesView,
		itembox:ItemBox,
		log:LogView,
		skills:SkillsPane,
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

		this.menuItems = ['main', 'skills', 'home'];

		this.unpause();

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

		itemover(elm, it) {
			this.overItem = it;
			this.overElm = elm;
		},

		itemout(elm ){
			if ( this.overElm===elm) {
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
		<itembox :item="overItem" :elm="overElm" />

		<resources :items="gameData.resources" @itemover="itemover" @itemout="itemout" />

		<vue-menu class="mid-view" :items="menuItems" active="main">

		<template slot="main">
		<actions :items="gameData.actions" @itemover="itemover" @itemout="itemout" @click="onAction" />
		<upgrades :items="gameData.upgrades" @itemover="itemover" @itemout="itemout" @click="onUpgrade" />

		</template>
	
		<template slot="home">
		<upgrades class="homes-view" :items="gameData.homes" @itemover="itemover" @itemout="itemout" :layout="'homes-view'" @click="onUpgrade" />
		</template>
	
		<template slot="skills">
			<skills :game-data="gameData"></skills>
		</template>

		</vue-menu>

		<log :log="game.log" />

	</div>
</template>