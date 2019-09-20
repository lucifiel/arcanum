<script>
import ProgBar from '../components/progbar.vue';
import ItemBase from '../itemsBase';

export default {

	mixins:[ItemBase],
	props:['npcs', 'label', 'player'],
	components:{
		prog:ProgBar
	},
	computed:{

	},
	methods:{

	}

}
</script>

<template>

<div>
	<span class="title" v-if="label">{{ label }}</span>
	<hr>
	<div v-if="player">
		<prog class="hp" :label="player.name"
		:value="player.hp.value" :max="player.hp.max.value" /></div>
	<div v-for="p in npcs" :key="p.id">
		<prog class="hp" :label="p.name" :value="p.hp" :max="p.maxHp.value" />
	</div>

</div>

</template>

<style scoped>

.title {
	font-weight: bold;
}

</style>