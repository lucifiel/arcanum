<script>
import ItemsBase from './itemsBase.js';
import Progress from './progbar.vue';

export default {
	
	/**
	 * @property {boolean} active - true if skill is the active skill.
	 */
	props:['skill', 'active'],
	mixins:[ItemsBase],
	components:{
		bar:Progress
	},
	computed:{

		width(){
			return this.skill.percent() + '%;'
		}

	}

}
</script>

<template>
	
	<div class="skill">

		<span class="separate">
			<span>{{ skill.name }}</span>&nbsp;<span>{{ 'lvl: ' + skill.level }}</span>
		</span>

		<div>

		<bar :value="skill.exp" :max="skill.max" />

		<button class="train-btn"
			@click="$emit('train',skill)"
				@mouseenter.capture.stop="dispatch('itemover', $event, skill )"
				@mouseleave.capture.stop="dispatch('itemout', $event )"> {{ active ? 'Stop' : 'Train' }}</button>

		</div>

	</div>

</template>

<style scoped>
button.train-btn {
	max-height:24px;
	margin:2px;
	padding:3px;
	text-justify: center;
}
</style>
