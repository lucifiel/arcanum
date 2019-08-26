<script>
import ItemsBase from './itemsBase.js';

export default {
	
	props:['items'],
	mixins:[ItemsBase],

	computed:{
		displayed(){
			return this.items.filter( v=>!v.hasType('mana')&&v.id!=='space')
		}		
	}

}
</script>


<template>
<div class="resource-list">

		<tr :class="{'item-name':true, locked:reslocked(it)}" v-for="it in displayed" :key="it.id"
			@mouseenter.capture.stop="dispatch('itemover',$event,it)">

			<td>{{ it.name }}</td>
			<td>{{ floor( it.value ) + ( it.max && it.max.value>0 ? '/' + floor(it.max.value) : '' )}}</td>
			<!--<td>{{ it.delta != 0 ? '&nbsp;(' + it.delta.toFixed(2) + '/t )' : ''}}</td>-->

		</tr>

</div>
</template>

<style scoped>

tr td:first-child {
	padding-right: 6px;
}

</style>