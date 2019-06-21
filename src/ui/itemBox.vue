<script>

import Game from '../game';

/**
 * Box for displaying item information.
 */
export default {

	props:["item", "elm"],
	data(){
		return {};
	},
	watch:{
		elm( newVal, oldVal ){
			if ( newVal != null ) {
				let style = this.$el.style;

				let left = newVal.offsetLeft;
				if ( left < window.innerWidth/2 ) {

					
					style['left'] = ( left + newVal.offsetWidth + 50 ) + 'px';

				} else {

					style['left'] = ( left - 300 ) + 'px';
				}

				style['top'] = ( newVal.offsetTop + 10 ) + 'px';

			}
		}
	},
	methods:{

		itemName(p) {
			let it = Game.getItem(p);
			return it ? it.name : '';
		},

		effectVal(v) {

			if ( !isNaN(v) ) return v;

		}

	}

}
</script>


<template>
	
	<div :class="{ 'item-popup':true, show:item!=null }">
		<div class='popup-content' v-if="item">
		<span class="name">{{item.name}}</span>
		<hr>

		<div v-if="item.cost">

			<div v-for="(val,prop) in item.cost" :key="prop">
				{{ itemName(prop) }}: {{ effectVal(val) }}
			</div>
		<hr>
		</div>

		<div v-if="item.effect">

			<div v-for="(val,prop) in item.cost" :key="prop">
				{{ itemName(prop) }}: {{ effectVal(val) }}
			</div>

		</div>

		<p v-if="item.desc">{{ item.desc }}</p>
		<span class="flavor" v-if="item.flavor">{{ item.flavor}}</span>
		</div>
	</div>

</template>
