<script>
import Game from '../game';
import ItemBase from './itemsBase';
import SkillView from './skill.vue';

export default {
	
	props:['state'],
	mixins:[ItemBase],
	components:{
		'skill':SkillView
	},
	computed:{

		skills(){
			return this.state.filterItems( it=>it.type==='skill' && !this.reslocked(it) );
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
	<div class="skills">

		<skill v-for="s in skills" :key="s.id" :skill="s" :active="s===state.curAction" @train="train"></skill>

	</div>
</template>

<style scoped>

div.skill {
	margin: 12px 0px;
}

</style>