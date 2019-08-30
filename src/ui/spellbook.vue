<script>
import ItemBase from './itemsBase';
import FilterBox from './components/filterbox.vue';
import Game from '../game';

export default {

	props:['state'],
	mixins:[ItemBase],
	data(){

		return {
			filtered:null,
			viewSchools:[],
			pMin:null,
			pMax:null
		};

	},
	components:{
		filterbox:FilterBox
	},
	computed:{



		minLevel:{

			get(){ return this.pMin; },
			set(v){ this.pMin = Number(v); }

		},

		/**
		 * @property {Object.<string,string>} schools - schools of all unlocked spells.
		 */
		schools() {

			let res = {};

			let a = this.spells;
			for( let i = a.length-1; i>= 0; i-- ) {
				var s = a[i];
				if ( s.school ) res[s.school] = true;
			}

			return res;
	
		},

		/**
		 * @property {Spell[]} viewing - array of spells actually visible.
		 */
		viewing() {

			let spells = this.filtered;
			let vSchools = this.viewSchools;
			let level = this.minLevel;

			if ( vSchools.length>0 || level ) {

				return spells.filter(v=>{
					return ((vSchools.length===0||vSchools.includes(v.school)) )
						&&(!level||(v.level===level));
				});

			}
			return spells;

		},

		/**
		 * @property {Spell} spells - array of spells unlocked.
		 */
		spells(){
			return this.state.filterItems(
				it=>it.type === 'spell' && !this.locked(it) );
		}

	}

}
</script>

<template>

	<div class="spellbook">

		<table>
		<tr v-for="s in viewing" :key="s.id">

			<td><button v-if="s.owned&&s.attack" @click="dispatch('primary',s)">
				{{ state.player.primary===s ? 'Unequip' : 'Primary' }}
				</button></td>
			<td>{{ s.name }}</td>
			<td>
				
				<button v-if="s.owned" @click="dispatch('spell', s)" :disabled="!usable(s)"
					@mouseenter.capture.stop="dispatch('itemover', $event, s )">Cast</button>

				<button v-else @click="dispatch('buy', s)" :disabled="!usable(s)"
					@mouseenter.capture.stop="dispatch('itemover', $event, s )">Learn</button>
	
			</td>

		</tr>
		</table>

		<div class="filters">

			<filterbox v-model="filtered" :items="spells" />

		<div>
			<label class="level-lbl" :for="elmId('level')">Level</label>
			<input class="level" :id="elmId('level')" type="number" v-model="minLevel" min=0 size=5>
		
		</div>
		
		<div class="checks" v-for="(p,k) in schools" :key="k">
					<input type="checkbox" :value="k" :id="elmId('chk'+k)" v-model="viewSchools" >
					<label :for="elmId('chk'+k)">{{ k }}</label>
		</div>
		</div>

	</div>

</template>

<style scoped>

div.spellbook {
	display:flex;
	flex-direction: row;
	justify-content: space-between;
}

.spellbook table{
	min-width: 50%;
}


div.filters{
	margin-left: 30px;
	margin-top:10px;
	line-height:30px;
	font-size: 1em;
}

.filters div.checks {
	margin: 8px 0px;
}

.filters input[type=number] {
	margin-left: 8px;
	text-decoration: none;
	line-height:28px;
}

</style>
