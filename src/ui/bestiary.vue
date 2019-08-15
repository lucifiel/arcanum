<script>
import Game from '../game';

export default {

	computed:{

		items(){
			return Game.state.monsters.filter( v=>v.value>=1 );
		}
	}

}
</script>

<template>

<table class="bestiary">
	<tr><th>Creature</th><th>Slain</th></tr>
	<tr v-for="b in items" :key="b.id">
		<th @mouseenter.capture.stop="dispatch('itemover',$event,b)">{{ b.name }}</th>
		<td class="num-align">{{ b.value }}</td>
	</tr>
</table>

</template>

<style scoped>

table {
	border-spacing: 4px 0px;
	border-collapse: collapse;
	row-gap: 4px;
	column-gap: 10px;

}

tr:first-child th {
	border-bottom: 1pt solid black;
	margin: 4px 4px;
}

tr > th:first-of-type {
	text-align: left;
}

th td {
	padding: 8px;
	margin: 8px;
}

td.num-align {
	text-align: right;

}
</style>