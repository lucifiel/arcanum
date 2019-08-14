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

<div class="bestiary">
	<div v-for="b in items" :key="b.id">
		{{ b.name }}<br>
		Slain: {{ b.value }}
	</div>
</div>

</template>

<style scoped>

</style>