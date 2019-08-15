<script>
import Game from '../game';

import ItemsBase from './itemsBase.js';
import Upgrades from './upgrades.vue'
/**
 * Component to pick current slot item from all available slot items.
 */
export default {

	/**
	 * @property {string} pick - slot to pick item for. (slot is Vue reserved)
	 * @property {?string} slotName - name to display to user. defaults to slot.
	 * @property {?Item[]} choices - list of items to filter. if not set, all game items are tested
	 * for a matching slot property.
	 * @property {?string} pickEvent - event to dispatch on item picked.
	 */
	props:['pick', 'slotName', 'choices', 'pickEvent'],
	mixins:[ItemsBase],
	data(){
		return {
			changing:false
		};
	},
	components:{
		'upgrades':Upgrades
	},
	methods:{

		toggleChange(){
			this.changing = !this.changing;
		}

	},
	computed:{

		/**
		 * Item currently in slot, or null.
		 */
		curItem(){
			return Game.state.getSlot(this.pick);
		},

		avail() {
			return this.choices ? this.choices.filter( v=>!Game.canUse(v) ) :
			Game.state.filterItems( v=>v.slot===this.pick&&Game.canUse(v) );
		}

	}

}
</script>

<template>
<div>

	<span>{{ slotName || pick }}: {{ curItem ? curItem.name : 'None'}}</span>
	<div v-if="avail.length>0">
	<button @click="toggleChange">{{ changing ? 'Done' : 'Choose' }}</button>
	<upgrades v-if="changing" class="slot-list" :items="avail" :pick-event="pickEvent" />
	</div>

</div>
</template>

<style scoped>

</style>