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
		<li v-for="it in resources" :key="it.def.id">{{ it.def.id + ': ' + format( it.value ) }}</li>
	</ul>

</div>
</template>