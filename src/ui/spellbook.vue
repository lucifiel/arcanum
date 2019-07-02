<script>
import ItemBase from './itemsBase';
import Game from '../game';

import ResoucesView from './resources.vue';

export default {

	props:['state'],
	mixins:[ItemBase],
	components:{

		mana:ResoucesView
	},
	methods: {

	},
	computed:{

		spells(){
			return this.state.filterItems(
				it=>it.type ==='spell' && !this.locked(it) );
		},
		mana(){

			return this.state.filterItems( it=>
				it.type ==='resource' && it.hasTag('mana') && !this.locked(it)
			);
		}

	}

}
</script>

<template>

	<div>

		<table>
		<tr v-for="s in spells" :key="s.id">

			<td><button v-if="s.learned&&s.attack" @click="dispatch('primary',s)">Primary</button></td>
			<td>{{ s.name }}</td>
			<td>
				
				<button v-if="s.learned" @click="dispatch('spell', s)" :disabled="!usable(s)"
					@mouseenter.capture.stop="dispatch('itemover', $event, s )"
					@mouseleave.capture.stop="dispatch('itemout', $event )">Cast</button>

				<button v-else @click="dispatch('learn', s)" :disabled="!usable(s)"
					@mouseenter.capture.stop="dispatch('itemover', $event, s )"
					@mouseleave.capture.stop="dispatch('itemout', $event )">Learn</button>
	
			</td>

		</tr>
		</table>

		<mana :items="mana" />

	</div>

</template>

<style scoped>

</style>
