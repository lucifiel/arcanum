<script>
import ItemsBase from '../itemsBase.js';
import Attack from './attack.vue';

export default {
	props:['item'],
	mixins:[ItemsBase],
	components:{
		attack:Attack
	}
}
</script>


<template>

<div class="item-info">
	<span class="item-name">{{item.name}}

			<span v-if="item.type==='resource'">&nbsp;&nbsp;&nbsp;{{
				item.current.toFixed(0) + ( item.max ? (' / ' + item.max) :'' ) }}</span>
		</span>

		<div>
		
		<span class="separate">
			<span v-if="item.level&&item.type!=='action'">lvl: {{item.level}}</span>
			<span v-if="item.slot">slot: {{ item.slot }}</span>
		</span>
		
			<div v-if="item.dist">distance: {{item.dist}}</div>
			<div v-if="item.armor">armor: {{ item.armor }}</div>
			<div class="item-desc" v-if="item.desc">{{ item.desc }}</div>

		</div>

		<div v-if="item.buy&&!item.owned">

			<hr>
			<div v-for="(v,k) in effectItems(item.buy)" :key="k">
				<span v-if="typeof v === 'boolean'">{{ k }}</span>
					<span v-else>{{ `${k}: ${v}` }}</span>
			</div>
			

		</div>
		<div v-if="item.cost">

			<hr>
			<div v-for="(v,k) in effectItems(item.cost)" :key="k">
				<span v-if="typeof v === 'boolean'">{{ k }}</span>
					<span v-else>{{ `${k}: ${v}` }}</span>
			</div>
			

		</div>
		<div v-if="item.run">

			<hr>
			<div v-for="(v,k) in effectItems(item.run)" :key="k">
				<span v-if="typeof v === 'boolean'">{{ k }}</span>
					<span v-else>{{ `${k}: ${v}` }}</span>
			</div>
			

		</div>
		<attack v-if="item.attack" :item="item.attack" />
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

</template>


<style scoped>


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