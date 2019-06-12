<script>
import { round } from 'format';

export default {
	
	props:['stats'],
	data(){
		console.log('this.stats: ' + this.stats );
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
		<li v-for="it in stats" :key="it.type.id">{{ it.type.id + ': ' + format( it.value ) }}</li>
	</ul>

</div>
</template>