<script>

import DataLoader from '../dataLoader';

import StatsView from './statsView.vue';
import OutView from './output.vue';

export default {

	props:['game'],
	data(){

		let data = this.game.gameData;
		
		return {

			gameData:data

		};


	},
	created(){

		this.lastUpdate = Date.now();

		setInterval( this.update, 200 );

	},
	components:{
		stats:StatsView
	},
	methods:{

		load() {
		},
		save() {
		},

		update() {

			let time = Date.now();
			let dt = ( time - this.lastUpdate )/1000;
			this.lastUpdate = time;

			console.log(dt);
			let stats = this.gameData.stats;
			let len = stats.length;
			for( let i = len-1; i >= 0; i-- ) {
				stats[i].update( dt );
			}

		},

		meditate(){
			this.game.getStat('mana').value++;
		},
		read() {
			this.game.getStat('arcanum').value++;
		}

	}

}
</script>

<template>

	<div class="main">

		<stats :stats="gameData.stats" />

		<div class="action-list">

			<button class="action-btn" @click="read">Read</button><br>
			<button class="action-btn" @click="meditate">Meditate</button><br>
			
		</div>

		<output :log="game.log" />

	</div>
</template>
