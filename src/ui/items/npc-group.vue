<script>
import ProgBar from '../components/progbar.vue';
import ItemBase from '../itemsBase';
import DotView from '../dotView.vue';

export default {

	mixins:[ItemBase],
	props:['npcs', 'label', 'player'],
	components:{
		prog:ProgBar,
		dots:DotView
	}

}
</script>

<template>

<div class="char-group">
	<span class="title" v-if="label">{{ label }}</span>
	<div v-if="player">
		<span>{{player.name }}</span><!--<dots class="inline" mini=true :dots="player.dots" />-->
		<prog class="hp"
		:value="player.hp.value" :max="player.hp.max.value" /></div>
	<div v-for="p in npcs" :key="p.id">
		<span>{{p.name }}</span><!--<dots class="inline" mini=true :dots="p.dots" />-->
		<prog class="hp" :value="p.hp" :max="p.maxHp.value" />
	</div>

</div>

</template>

<style scoped>

.title {
	font-weight: bold;
}

</style>