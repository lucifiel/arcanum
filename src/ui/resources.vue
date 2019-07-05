<script>
import ItemsBase from './itemsBase.js';

export default {
	
	mixins:[ItemsBase],
	data(){
		return {
		}
	}

}
</script>


<template>
<div class="resource-list">

	<table>
		<tr :class="{'item-name':true, locked:reslocked(it)}" v-for="it in items" :key="it.id"
			@mouseenter.capture.stop="dispatch('itemover',$event,it)">

			<td>{{ it.name }}</td>
			<td>{{ round( it.value ) + ( it.max && it.max.value>0 ? '/' + round(it.max.value) : '' )}}</td>
			<td>{{ it.delta != 0 ? '&nbsp;(' + it.delta.toFixed(2) + '/t )' : ''}}</td>

		</tr>
	</table>

</div>
</template>