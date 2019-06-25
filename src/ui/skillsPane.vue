<script>

import SkillView from './skillView.vue';

export default {
	
	props:['gameData'],
	data(){

		return {
			skills:this.gameData.skills
		};

	},
	components:{
		'skill':SkillView
	},
	methods:{

		train(skill){
			this.gameData.curAction = this.gameData.curAction !== skill ? skill : null;
		}

	}

}
</script>

<template>
	<div class="skills-view">

		<skill v-for="s in skills" :key="s.id" :game="gameData" :skill="s"></skill>

	</div>
</template>
