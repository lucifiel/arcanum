<script>
import Game from '../../game';
import Group from './npc-group.vue';

export default {

	props:['combat'],
	components:{
		'npc-group':Group
	},
	computed:{
	}

}
</script>

<template>

<div class="combat">

	<npc-group class="group" :npcs="combat.enemies" label="enemies" />
	<npc-group class="group" v-if="combat.allies.length>0" :npcs="combat.allies" label="allies" />

</div>

</template>

<style scoped>

.combat {
	display:flex;
	flex-flow: row-reverse nowrap;
	width:100%;
}

.group {

	width:45%;
	max-width:45%;
	min-height:120px;
	border: 2px solid black;
	border-radius: 8px;
	padding: 12px;

}

</style>