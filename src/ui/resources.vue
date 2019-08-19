<script>
import ItemsBase from './itemsBase.js';

export default {
	
	mixins:[ItemsBase]

}
</script>


<template>
<div class="resource-list">

		<tr :class="{'item-name':true, locked:reslocked(it)}" v-for="it in items" :key="it.id"
			@mouseenter.capture.stop="dispatch('itemover',$event,it)">

			<td>{{ it.name }}</td>
			<td>{{ floor( it.value ) + ( it.max && it.max.value>0 ? '/' + floor(it.max.value) : '' )}}</td>
			<!--<td>{{ it.delta != 0 ? '&nbsp;(' + it.delta.toFixed(2) + '/t )' : ''}}</td>-->

		</tr>

</div>
</template>