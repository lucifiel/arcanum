<script>
import ItemsBase from './itemsBase.js';
import Game from '../game';

export default {
	
	props:['resources'],
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

	<ul>
		<li :class="{'item-name':true, locked:locked(it)}" v-for="it in items" :key="it.id">
			{{ it.name + ': ' + round( it.value ) }}
			{{ it.max && it.max.value>0 ? '/' + round(it.max.value) : ''}}
			{{ it.delta != 0 ? '&nbsp;(' + it.delta.toFixed(2) + '/t )' : ''}}
		</li>
	</ul>

</div>
</template>