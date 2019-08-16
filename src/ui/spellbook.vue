<script>
import ItemBase from './itemsBase';
import Game from '../game';

export default {

	props:['state'],
	mixins:[ItemBase],
	data(){

		return {
			school:null,
			pMin:null,
			pMax:null
		};

	},
	methods: {

	},
	computed:{

		minLevel:{

			get(){return this.pMin;},
			set(v){
				this.pMin = Number(v);
			}

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

			let spells = this.spells;
			let school = this.school;
			let level = this.minLevel;

			if ( school || level ) {

				return spells.filter(v=>{
					return (!school||v.school===school)&&(!level||(v.level===level));
				});

			}
			return spells;

		},

		/**
		 * @property {Spell} spells - array of spells unlocked.
		 */
		spells(){
			return this.state.filterItems(
				it=>it.type ==='spell' && !this.locked(it) );
		}

	}

}
</script>

<template>

	<div>

		<label :for="elmId('level')">Level</label>
		<input :id="elmId('level')" type="number" v-model="minLevel">
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

		<!--<mana :items="mana" />-->

	</div>

</template>

<style scoped>

</style>
