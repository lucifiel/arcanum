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
		<li :class="{'item-name':true, locked:locked(it)}" v-for="it in items" :key="it.id">{{ it.name + ': ' + round( it.value ) }}</li>
	</ul>

</div>
</template>