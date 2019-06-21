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

		effectName(p) {
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
			return v.toString();

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

			<div v-for="(val,prop) in item.cost" :key="prop">
				{{ effectName(prop) }}: {{ effectVal(val) }}
			</div>
		</div>

		<div v-if="item.effect||item.mod">
			<hr>
		<div class="note-text">effects:</div>
		<div v-if="item.effect">

			<div v-for="(val,prop) in item.effect" :key="prop">
				{{ effectName(prop) }}: <span v-html="effectVal(val)"></span>
			</div>

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
