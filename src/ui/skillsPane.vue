<script>

import ItemBase from './itemsBase';
import SkillView from './skillView.vue';

export default {
	
	props:['gameData'],
	mixins:[ItemBase],
	components:{
		'skill':SkillView
	},
	computed:{

		skills(){
			return this.gameData.filterItems( it=>it.type==='skill' && !this.locked(it) );
		}
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

		<skill v-for="s in skills" :key="s.id" :skill="s" :active="s===gameData.curAction" @train="train"></skill>

	</div>
</template>
