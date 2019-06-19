<script>
import ItemsBase from './itemsBase.js';

export default {
	
	props:['skill', 'game'],
	mixins:[ItemsBase],
	methods: {

		train() {
			this.game.curSkill = (this.game.curSkill !== this.skill ) ? this.skill : null;
		}

	}

}
</script>

<template>
	
	<div class="skill">

		<span>{{ skill.name }}</span>
		<div class="exp-bar">
			<div ref="fill"></div>
		</div>

		<button class="train-btn"
			@click="train" @mouseover="mouseover" @mouseout="mouseout">Train</button>

	</div>

</template>
