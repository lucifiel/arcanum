<script>

import ResoucesView from './resourcesView.vue';
import ActionsView from './actionsView.vue';
import UpgradesView from './upgradesView.vue';

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
		log:LogView
	},
	data(){

		let data = this.game.gameData;
		
		return {
			gameData:data
		};


	},
	created(){

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

		<resources :items="gameData.resources" />

		<div>
		<actions :items="gameData.actions" @click="onAction" />
		<upgrades :items="gameData.upgrades" @click="onUpgrade" />
		</div>

		<upgrades :items="gameData.homes" :layout="'homes-view'" @click="onUpgrade" />

		<log :log="game.log" />

	</div>
</template>