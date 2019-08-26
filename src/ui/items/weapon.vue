<script>
import Range from '../../range';
import Item from  './item.vue';
import Attack from './attack.vue';

export default {

	props:['item'],
	name:'attack',
	components:{
		subitem:Item
	},
	computed:{

	}

}
</script>

<template>

<div class="attack">

	<div>hit bonus: {{ item.tohit || 0 }}</div>
	<div v-if="item.hands>1">Two Handed</div>
	<div>kind: {{ item.kind }}</div>	
	<subitem v-if="item.dot" :item="item.dot" />
	
</div>

</template>