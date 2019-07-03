<script>

import { round } from 'format';

export default {
	
	props:['player'],
	computed:{

		name:{
			get(){ return this.player.name; },
			set(v){
				if ( v ) this.player.name = v;
			}
		}
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
			<input type="text" v-model.lazy="name"></th></tr>
		<tr><td>title</td><th> {{ player.title}}</th></tr>
		<tr><td>alignment</td><th>{{player.alignment}}</th></tr>
		<tr><td>level</td><th> {{ player.level }}</th></tr>
		<tr><td>exp</td><th> {{ round(player.exp) }} / {{ round(player.next ) }} </th></tr>
		<tr><td>hp</td><th>
			{{ round( player.hp.value ) }} / {{ round( player.hp.max.value ) }}</th></tr>
			<tr><td>stamina</td><th>
			{{ round( player.stamina.value ) }} / {{ round(player.stamina.max.value )}}</th></tr>
		
		</table>

	</div>

</template>

<style scoped>
input[type=text] {
	border: none;
	border-bottom: 1px solid black;
	margin: 1px;
}

td th {
	padding: 2px 4px;
}

td {
	text-align:right;
}

th {
	text-align: left;
}

</style>

