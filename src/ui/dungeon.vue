<script>

import ProgBar from './progbar.vue';

/**
 * Single dungeon view.
 */
export default {

	props:['dungeon'],
	components:{
		progbar:ProgBar
	}

}
</script>


<template>
	<div class="dungeon" v-if="dungeon">

		<progbar class="dungeon" :label="dungeon.name" :value="dungeon.progress" :max="dungeon.length" />
		<button class="raid-btn" @click="dispatch( 'raid', dungeon )">Enter</button>

	</div>
</template>

<style scoped>

</style>