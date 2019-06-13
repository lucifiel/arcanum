<script>

import DataLoader from '../dataLoader';

import ResoucesView from './resourcesView.vue';
import ActionsView from './actionsView.vue';
import UpgradesView from './upgradesView';

import OutView from './output.vue';

export default {

	props:['game'],
	components:{
		resources:ResoucesView,
		actions:ActionsView,
		upgrades:UpgradesView,
		output:OutView
	},
	data(){

		let data = this.game.gameData;
		
		return {
			gameData:data
		};


	},
	created(){

		this.lastUpdate = Date.now();

		

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

			if ( !this.interval ) this.interval = setInterval( this.update, 200 );

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

		actionClicked( id ) {

			this.game.applyAction(id);

		},

		meditate(){
			this.game.getResource('amna').value++;
		},
		read() {
			this.game.getResource('arcanum').value++;
		}

	}

}
</script>

<template>

	<div class="main">

		<resources :resources="gameData.resources" />

		<actions :actions="gameData.actions" @click="actionClicked" />

		<div class="action-list">

			<button class="action-btn" @click="read">Read</button><br>
			<button class="action-btn" @click="meditate">Meditate</button><br>
			
		</div>

		<output :log="game.log" />

	</div>
</template>
