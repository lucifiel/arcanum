<script>
import Game from '../../game';

import ItemsBase from '../itemsBase.js';
import InfoBlock from './info-block.vue';
import Attack from './attack.vue';

import {precise} from '../../util/format';

export default {
	props:['item'],
	name:"gdata",
	mixins:[ItemsBase],
	components:{
		info:InfoBlock,
		attack:Attack
	},
	methods:{
		sellPrice(it){
			return Game.sellPrice(it);
		},
		precise(v){return precise(v);}
	}

}
</script>


<template>

<div class="item-info">
	<span class="separate">
		<span class="item-name">{{item.name}}</span>

			<span v-if="item.type==='resource'">{{
				item.current.toFixed(0) + ( item.max ? (' / ' + Math.floor(item.max.value ) ) :'' ) }}</span>
			<span v-else-if="item.type==='furniture'">max: {{
				item.max ? Math.floor(item.max.value ) : ( (item.repeat) ? '&infin;' : 1) }}</span>

	</span>
		<span class="flex-right" v-if="item.rate&&item.rate.value!=0">{{ precise( item.rate.value ) }} /s</span>
		<div>


		<span class="separate">
			<span v-if="item.level&&item.type!=='action'">lvl: {{item.level}}</span>
			<span v-if="item.slot">slot: {{ item.slot }}</span>
		</span>

			<div v-if="item.dist">distance: {{item.dist}}</div>
			<div v-if="item.armor">armor: {{ item.armor }}</div>
			<div class="item-desc" v-if="item.desc">{{ item.desc }}</div>

		</div>

		<info v-if="item.need" :info="item.need" title="need" />
		<info v-if="item.buy&&!item.owned" :info="item.buy" title="purchase cost" />
		<info v-if="item.cost" :info="item.cost" title="cost" />
		<info v-if="item.sell||item.instance||item.type==='furniture'" :info="sellPrice(item)" title="sell" />
		<info v-if="item.run" :info="item.run" title="progress cost" rate="true" />

		<attack v-if="item.attack" :item="item.attack" />

		<div v-if="item.effect||item.mod||item.result" class="note-text"><hr>effects:</div>
		<info v-if="item.effect" :info="item.effect" :rate="runnable(item)" />
		<info v-if="item.mod" :info="item.mod" />
		<info v-if="item.result" :info="item.result" />

		<div v-if="item.lock||item.disable" class="note-text"><hr>locks:</div>
		<info v-if="item.lock" :info="item.lock" />
		<info v-if="item.disable" :info="item.disable" />

		<div class="note-text" v-if="item.flavor">{{ item.flavor}}</div>
</div>

</template>


<style scoped>

hr {
margin-bottom: 4px;
}

div.item-desc {
	margin: 5px 0px 10px;
	font-size: 0.96em;
}

.item-name {
	font-weight: bold;
}
.flavor {
	font-style: italic;
}

</style>