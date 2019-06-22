<script>
import ItemsBase from './itemsBase.js';
import Game from '../game';

export default {
	
	mixins:[ItemsBase],
	data(){
		return {
		}
	},
	methods:{
	}

}
</script>


<template>
<div class="resource-list">

	<table>
		<tr :class="{'item-name':true, locked:locked(it)}" v-for="it in items" :key="it.id"
			@mouseenter.capture.stop="dispatch('itemover',$event,it)"
			@mouseleave.capture.stop="dispatch( 'itemout', $event)">

			<td>{{ it.name }}</td>
			<td>{{ round( it.value ) + ( it.max && it.max.value>0 ? '/' + round(it.max.value) : '' )}}</td>
			<td>{{ it.delta != 0 ? '&nbsp;(' + it.delta.toFixed(2) + '/t )' : ''}}</td>

		</tr>
	</table>

</div>
</template>