<script>
import Game from '../game';

import ItemView from './items/item.vue';

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

				let style = this.$el.style;
				let rect = newVal.getBoundingClientRect();
				//let myBox = this.$el.getBoundingClientRect();

				let left = rect.left;
				if ( left < window.innerWidth/2 ) {

				//	console.log('left: ' + left);
					style['left'] = ( left + newVal.offsetWidth + 40 ) + 'px';

				} else {

					//console.log('width: ' + myBox.width + ' , ' + myBox.right );
					style['left'] = ( left- 240 ) + 'px';
				}

				if ( rect.top < window.innerHeight-140) style['top'] = ( rect.top ) + 'px';
				else style.top = (rect.top - 52) + 'px';

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