<script>
import Game from '../game';
import ItemBase from './itemsBase';
import SkillView from './items/skill.vue';

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

		<filterbox v-model="filtered" :items="skills" min-items="7" />

		<div class="subs">
			<skill v-for="s in filtered" :key="s.id" :skill="s" :active="s===state.curAction" @train="train"></skill>
		</div>

	</div>
</template>

<style scoped>

div.skills {
	height:100%;
	display:flex;
	flex-flow: column nowrap;
}
div.subs {
	max-height: 100%;
	width: 100%;
	overflow-y: auto;
}

div.skill {
	margin: 18px 0px;
}

</style>