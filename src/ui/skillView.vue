<script>
import ItemsBase from './itemsBase.js';

export default {
	
	props:['skill', 'game'],
	mixins:[ItemsBase],
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
		<div class="exp-bar">
			<div v-if="skill.exp>0" ref="fill" :style="'width:'+width"> </div>
			<div v-else>&nbsp;</div>
		</div>

		<button class="train-btn"
			@click="train" @mouseover="mouseover" @mouseout="mouseout">Train</button>
		</div>

	</div>

</template>
