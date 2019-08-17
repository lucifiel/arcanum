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

		width(){ return this.skill.percent() + '%;' }

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
span.separate {
	text-align: center;
}
button.train-btn {
	max-height:24px;
	margin-top:4px;
	padding:3px;
}
</style>
