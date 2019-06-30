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
		<tr><td class="prop">name</td><th class="value">
			<input type="text" v-model.lazy="name"></th></tr>
		<tr><td class="prop">title</td><th class="value"> {{ player.title}}</th></tr>
		<tr><td class="prop">level</td><th class="value"> {{ player.level }}</th></tr>
		<tr><td class="prop">exp</td><th class="value"> {{ round(player.exp) }} / {{ round(player.next ) }} </th></tr>
		<tr><td class="prop">hp</td><th class="value">
			{{ round( player.hp.value ) }} / {{ round( player.hp.max.value ) }}</th></tr>
			<tr><td class="prop">stamina</td><th class="value">
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
</style>

