<script>
import Game from '../game';
import ItemBase from './itemsBase';
import SkillView from './items/skill.vue';

import FilterBox from './components/filterbox.vue';

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

		skills() { return this.state.skills; },

		available(){
			return this.skills.filter(it=> !this.reslocked(it) );
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

		<filterbox v-model="filtered" :items="available" min-items="7" />

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
	align-items: center;
}


div.subs {
	display:flex;
	flex-flow: row wrap;
	margin: 12px 0px 0px 0px;
	padding: 12px 24px;
	width: 98%;
	overflow-y: auto;
	justify-content: space-between;
}

div.skill {
	margin-bottom: 20px;
	width:40%;
}

</style>