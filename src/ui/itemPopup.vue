<script>
import Game from '../game';

import ItemView from './items/item.vue';
import {positionAt} from './components/popups.js';


/**
 * Box for displaying item information.
 */
export default {

	/**
	 * @property {boolean} sell - if the pane is a sell-view.
	 */
	props:["item", "elm", 'sell'],
	watch:{
		elm( newVal, oldVal ){

			if ( newVal != null ) {
				positionAt( this.$el, newVal );
			}

		}
	},
	components:{ item:ItemView }

}
</script>


<template>
	
	<div :class="{ 'item-popup':true }" v-show="item!=null">
		<item class='popup-content' v-if="item" :item="item" />
	</div>

</template>

<style scoped>

.item-popup {
	height:auto;
	min-height:100px;
	min-width:200px;
	max-width:240px;
	position: absolute;
	z-index:10000;
	top:0;
	background:white;
	border: 1.5px solid rgb( 100, 100,100);
	border-radius: 0.20rem;
}
.popup-content {
	padding: 10px;
}

</style>