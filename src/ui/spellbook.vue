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

		<mana :items="mana" />

	</div>

</template>

<style scoped>

</style>
