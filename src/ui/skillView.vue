<script>
import ItemsBase from './itemsBase.js';
import Progress from './progbar.vue';

export default {
	
	props:['skill', 'game'],
	mixins:[ItemsBase],
	components:{
		bar:Progress
	},
	methods: {

		train() {
			this.game.curSkill = (this.game.curSkill !== this.skill ) ? this.skill : null;
		}

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
			@click="train"
				@mouseenter.capture.stop="dispatch('itemover', $event, skill )"
				@mouseleave.capture.stop="dispatch('itemout', $event )">Train</button>

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
