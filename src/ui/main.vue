<script>

import DataLoader from '../dataLoader';

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
				this.lastUpdate = Date.now();
				this.interval = setInterval( this.update, 200 );
			}

		},

		update() {

			let time = Date.now();
			let dt = ( time - this.lastUpdate )/1000;
			this.lastUpdate = time;

			let stats = this.gameData.resources;
			let len = stats.length;
			for( let i = len-1; i >= 0; i-- ) {
				stats[i].update( dt );
			}

		},

		onAction( action ) {

			this.game.tryAction( action );

		},

	}

}
</script>

<template>

	<div class="main">

		<resources :resources="gameData.resources" />

		<actions :actions="gameData.actions" @click="onAction" />

		<log :log="game.log" />

	</div>
</template>