<script>
import { round } from 'format';

export default {
	
	props:['resources'],
	data(){
		console.log('this.resources: ' + this.resources );
		return {
		}
	},
	methods:{
		format:round
	}

}
</script>


<template>
<div class="stat-list">

	<ul>
		<li v-for="it in resources" :key="it.type.id">{{ it.type.id + ': ' + format( it.value ) }}</li>
	</ul>

</div>
</template>