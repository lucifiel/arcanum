<script>
import ProgBar from '../components/progbar.vue';
import ItemBase from '../itemsBase';

export default {

	mixins:[ItemBase],
	props:['npcs', 'label'],
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
	<div v-for="p in npcs" :key="p.id">
		<prog :label="p.name" :value="p.hp" :max="p.maxHp" />
	</div>

</div>

</template>

<style scoped>

.title {
	font-weight: bold;
}

</style>