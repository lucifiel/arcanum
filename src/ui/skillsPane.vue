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

		sp() { return this.state.getData('sp'); },

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

		<span class="separate"><filterbox v-model="filtered" :items="available" min-items="7" /><span style="align-self:center">Skill Points: {{ sp.value.toFixed(2) }}</span></span>

		<div class="subs">
			<skill v-for="s in filtered" :key="s.id" :skill="s" :active="s===state.curAction" @train="train"></skill>
		</div>

	</div>
</template>

<style scoped>

.separate {
	width:70%;
}

div.skills {
	height:100%;
	width:100%;
	display:flex;
	flex-flow: column nowrap;
	align-items: center;
}


div.subs {
	display:flex;
	flex-flow: row wrap;
	margin: 12px 0px 0px 0px;
	padding: 12px 8px;
	overflow-y: auto;
	justify-content: space-between;
}

div.skill {
	margin-bottom: 20px;
	width:40%;
}

</style>