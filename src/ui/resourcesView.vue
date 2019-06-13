<script>
import { round } from 'format';

export default {
	
	props:['resources'],
	data(){
		return {
		}
	},
	methods:{
		format:round
	}

}
</script>


<template>
<div class="resource-list">

	<ul>
		<li class="item-name" v-for="it in resources" :key="it.def.id">{{ it.name + ': ' + format( it.value ) }}</li>
	</ul>

</div>
</template>