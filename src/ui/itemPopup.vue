<script>

import Game from '../game';
import VarPath from '../varPath';

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
				let rect = newVal.getBoundingClientRect();

				let left = rect.left;
				if ( left < window.innerWidth/2 ) {

				//	console.log('left: ' + left);
					style['left'] = ( left + newVal.offsetWidth + 40 ) + 'px';

				} else {

					//console.log('left: ' + left);
					style['left'] = ( left-240 ) + 'px';
				}

				style['top'] = ( rect.top ) + 'px';

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

		costName(p) {
			let it = Game.getItem(p);
			return it ? it.name : 'gold';
		},

		effectItems(obj) {

			let type = typeof obj;
			let results = {};

			if ( type === 'string') {

				let it = Game.getItem(obj);
				results[ it ? it.name : obj ] = true;

			} else if ( obj instanceof Array ) obj.forEach(v=>this.effectList(v,results));
			else if ( type === 'object') {

				this.effectList( obj, results );

			}

			return results;

		},

		/**
		 * @param {Object} results - object to collect results.
		 * @param {string} propPath - prop path from base.
		 */
		effectList( obj, results={}, propPath='' ) {

			for( let p in obj ) {

				var subPath = p;
				var sub = obj[p];

				if ( p === 'skipLocked') continue;
				else if ( p === 'max' ) {

					subPath = 'max ' + propPath;

				} else if ( p==='base' || p === 'value') subPath = propPath;
				else if ( p === 'rate') {

					subPath = propPath;
					if ( typeof sub !== 'object' ) sub = sub + '/s';

				} else {

					// check if sub-prop refers to an item.
					let refItem = Game.getItem(p);
					if ( refItem ) subPath = refItem.name;

					subPath = propPath ? propPath + ' ' + subPath : subPath;

				}

				if ( typeof sub !== 'object' ) results[subPath] = sub;
				else {

					if ( sub.skipLocked ) {
						let refItem = Game.getItem(p);
						if ( refItem && refItem.locked || refItem.disabled ) continue;
					}
					this.effectList( sub, results, subPath );

				}

			}

		},

		effectVal(v) {

			if ( !isNaN(v) ) return v;
			if ( v instanceof Object ) {

				let res = '';
				if ( v.value !== undefined ) res += v.value + '<br>';
				if ( v.max !== undefined ) res += v.max + '<br>';
				if ( v.base !== undefined ) res += v.base + '/s<br>';
				if ( v.rate !== undefined ) res += v.rate + '/s<br>';
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
		<span class="item-name">{{item.name}}

			<span v-if="item.type==='resource'">&nbsp;&nbsp;&nbsp;{{ item.value.toFixed(0) + ' / ' + item.max }}</span>
		</span>
		<div class="item-desc" v-if="item.desc">{{ item.desc }}</div>
		<div v-if="item.cost">

			<hr>
			<!--<span class="note-text">cost:</span>-->
			<div v-if="!isNaN(item.cost)">
				Gold: {{ item.cost }}
			</div>
			<div v-else v-for="(val,prop) in item.cost" :key="prop">
				{{ costName(prop) }}: {{ effectVal(val) }}
			</div>
			

		</div>
		<div v-if="item.effect||item.mod||item.result">

			<hr>
			<div class="note-text">effects:</div>

			<div v-for="(obj,key) in [item.effect,item.mod,item.result]" :key="key">

				<div v-for="(v,k) in effectItems(obj)" :key="k">

					<span v-if="typeof v === 'boolean'">{{ k }}</span>
					<span v-else>{{ `${k}: ${v}` }}</span>

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