<script>

import Game from '../game';

/**
 * Box for displaying item information.
 */
export default {

	/**
	 * @property {boolean} sell - if the pane is a sell-view.
	 */
	props:["item", "elm", 'sell'],
	data(){
		return {};
	},
	watch:{
		elm( newVal, oldVal ){
			if ( newVal != null ) {
				let style = this.$el.style;

				let left = newVal.offsetLeft;
				if ( left < window.innerWidth/2 ) {

					
					style['left'] = ( left + newVal.offsetWidth + 40 ) + 'px';

				} else {

					style['left'] = ( left - 300 ) + 'px';
				}

				style['top'] = ( newVal.offsetTop + 10 ) + 'px';

			}
		}
	},
	computed:{

		/**
		 * Do not show skipLocked effects/mods.
		 */

		/**
		 * @method effects
		 */
		effects(){
		},

		mods(){
		}

	},
	methods:{

		effectName(p) {
			let it = Game.getItem(p);
			return it ? it.name : p;
		},

		costName(p) {
			let it = Game.getItem(p);
			return it ? it.name : 'Gold';
		},

		modName( p, val ){

			let it = Game.getItem(p);
			if ( !it ) return '';

			if ( val instanceof Object && val.max ) return 'Max ' + it.name;
			return it.name;

		},

		effectVal(v) {

			if ( !isNaN(v) ) return v;
			if ( v instanceof Object ) {

				let res = '';
				if ( v.value !== undefined ) res += v.value + '<br>';
				if ( v.max !== undefined ) res += v.max + '<br>';
				if ( v.base !== undefined ) res += v.base + '/s<br>';
				if ( v.pct !== undefined ) res += v.pct + '%<br>';

				return res;
			}
			return '';

		}

	}

}
</script>


<template>
	
	<div :class="{ 'item-popup':true, show:item!=null }">
		<div class='popup-content' v-if="item">
		<span class="item-name">{{item.name}}</span>
		<div class="item-desc" v-if="item.desc">{{ item.desc }}</div>

		<div v-if="item.cost">

			<hr>

			<div v-if="!isNaN(item.cost)">
				Gold: {{ item.cost }}
			</div>
			<div v-else v-for="(val,prop) in item.cost" :key="prop">
				{{ costName(prop) }}: {{ effectVal(val) }}
			</div>

		</div>

		<div v-if="item.effect||item.mod">
			<hr>
		<div class="note-text">effects:</div>
		<div v-if="item.effect instanceof Object">

			<div v-for="(val,prop) in item.effect" :key="prop">
				{{ effectName(prop) }}: <span v-html="effectVal(val)"></span>
			</div>

		</div>
		<div v-else-if="typeof item.effect === 'string'">
			{{ effectName( item.effect ) }}
		</div>

		<div v-if="item.mod">

			<div v-for="(val,prop) in item.mod" :key="prop">
				{{ modName(prop) }}: <span v-html="effectVal(val)"></span>
			</div>

		</div>
		</div>

		<span class="note-text" v-if="item.flavor">{{ item.flavor}}</span>
		</div>
	</div>

</template>

<style scoped>

.item-popup {
	display:none;
	height:auto;
	min-height:100px;
	min-width:200px;
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
.show {
	display: inline-block;
}


div.item-desc {
	margin: 5px 0px 10px;
	font-size: 0.96em;
}

.item-popup .item-name {
	font-weight: bold;
}
.item-popup .flavor {
	font-style: italic;
}

</style>