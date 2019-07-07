<script>
import Game from '../game';
import ItemBase from './itemsBase';
import SkillView from './skill.vue';

export default {
	
	props:['gameData'],
	mixins:[ItemBase],
	components:{
		'skill':SkillView
	},
	computed:{

		skills(){
			return this.gameData.filterItems( it=>it.type==='skill' && !this.reslocked(it) );
		}
	},
	methods:{

		train(skill){
			Game.toggleAction( skill );
		}

	}

}
</script>

<template>
	<div class="skills-view">

		<skill v-for="s in skills" :key="s.id" :skill="s" :active="s===gameData.curAction" @train="train"></skill>

	</div>
</template>
