<script>

import FilterBox from './component/filterbox.vue';

export default {

	/**
	 * @property {Inventory} inv - the inventory object.
	 */
	props:['inv'],
	data() {
		return {
			filtered:null
		}
	},
	components:{
		filterbox:FilterBox
	}

}
</script>


<template>
<div>
	<filterbox v-model="filtered" :items="inv.items" min-items="10" />
<table class="inv item-table">
	<tr v-for="it in filtered" :key="it.id">
		<td @mouseenter.capture.stop="dispatch('itemover',$event,it)">{{ it.name }}</td>
		<td><button @click="dispatch('equip',it)" @mouseenter.capture.stop="dispatch('itemover',$event,it)">Equip</button></td>
		<td><button @click="dispatch('drop',it)">Drop</button></td>
	</tr>
</table>
</div>
</template>


<style scoped>

.inv {
	margin-left: 48px;
	width:auto;
	height:auto;
}


</style>