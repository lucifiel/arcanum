<script>
import ItemsBase from './itemsBase.js';
import Progress from './component/progbar.vue';

export default {
	
	/**
	 * @property {boolean} active - true if skill is the active skill.
	 */
	props:['skill', 'active'],
	mixins:[ItemsBase],
	components:{
		bar:Progress
	}
}
</script>

<template>
	
	<div class="skill">

		<span class="separate">
			<span>{{ skill.name }}</span>&nbsp;
			<span v-if="skill.owned">{{ 'lvl: ' + skill.level }}<button class="train-btn"
			@click="$emit('train',skill)" :disabled="!this.usable(skill)"
				@mouseenter.capture.stop="dispatch('itemover', $event, skill )"> {{ active ? 'Stop' : 'Train' }}</button></span>
			<span v-else>
				<button @click="dispatch('buy', skill)"
					@mouseenter.capture.stop="dispatch('itemover', $event, skill )">Unlock</button>
			</span>
		</span>

		<div v-if="skill.owned">

		<bar :value="skill.progress" :max="skill.length" />

		</div>

	</div>

</template>

<style scoped>

div.skill {
	width: 33%;
}

span.separate {
	width: 100%;
	align-items: center;
}
button {
	max-height:36px;
	margin-top:4px;
	padding:3px;
}
</style>
