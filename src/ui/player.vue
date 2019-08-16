<script>
import Game from '../game';
import { round } from 'format';

import AllUpgrades from './allupgrades.vue';
import SlotPick from './slotpick.vue';

export default {
	
	computed:{

		name:{
			get(){ return this.player.name; },
			set(v){
				if ( v ) this.player.name = v;
			}
		},
		title(){ return this.player.title; },
		speed() { return this.player.speed; },
		stamina() { return this.player.stamina; },
		level() {return this.player.level; },
		hp() {return this.player.hp; },
		defense() {return this.player.defense; },
		tohit() {return this.player.tohit; },
		exp() {return this.round( this.player.exp.value ); },
		next() {return this.round( this.player.next ); },
		mount() { return Game.state.getSlot('mount'); },
		dist() { return Game.state.getItem('dist').value; }


	},
	components:{
		'upgrades':AllUpgrades,
		'slotpick':SlotPick
	},
	beforeCreate(){

		this.player = Game.state.player;
	},
	methods:{
		round:round
	}

}
</script>


<template>

	<div class="player-view">

		<table>
		<tr><td>name</td><th>
			<input type="text" v-model="name"></th></tr>
		<tr><td>title</td><th> {{ title}}</th></tr>
		<tr><td>alignment</td><th>{{ player.alignment }}</th></tr>
		<tr><td>level</td><th> {{ level }}</th></tr>
		<tr><td>exp</td><th> {{ exp }} / {{ next }} </th></tr>
		<tr><td>hp</td><th>
			{{ round( hp.value ) }} / {{ round( hp.max.value ) }}</th></tr>

		<tr><td>defense</td><th>{{ defense }}</th></tr>
		<tr><td>hit bonus</td><th>{{ tohit }}</th></tr>


			<tr><td>stamina</td><th>
			{{ round( stamina.value ) }} / {{ round(stamina.max.value )}}</th></tr>
		
		<tr><td>speed</td><th>{{ speed.value }}</th></tr>

		<tr><td>mount</td><th><slotpick class="inline-block" pick="mount" /></th></tr>
		<tr><td>distance</td><th>{{ dist }}</th></tr>
		</table>

		<upgrades></upgrades>

	</div>

</template>

<style scoped>

div.player-view {
	display:flex;
	flex-direction: row;
	justify-content: space-between;
}

input[type=text] {
	border: none;
	border-bottom: 1px solid black;
	margin: 1px;
}

td, th {
	padding: 2px 4px;
}

td {
	text-align:right;
}

th {
	text-align: left;
}

</style>

