<script>
import Game from '../game';
import ItemBase from './itemsBase';
import SkillView from './skill.vue';

import FilterBox from './component/filterbox.vue';

export default {
	
	props:['state'],
	mixins:[ItemBase],
	components:{
		skill:SkillView,
		filterbox:FilterBox
	},
	data() {

		return {
			/**
			 * @property {Item[]} filtered - filtered search results.
			 */
			filtered:null
		}
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

		<filterbox v-show="skills.length>=8" v-model="filtered" :items="skills" />

		<skill v-for="s in filtered" :key="s.id" :skill="s" :active="s===state.curAction" @train="train"></skill>

	</div>
</template>

<style scoped>

div.skill {
	margin: 12px 0px;
}

</style>