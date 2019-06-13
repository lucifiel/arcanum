<script>
import { round } from 'format';

export default {
	
	props:['actions'],
	data(){
		console.log('this.actions: ' + this.actions );
		return {
		}
	},
	methods:{
		format:round
	}

}
</script>


<template>
<div class="action-list">

	<ul>
		<li v-for="it in actions" :key="it.type.id">{{ it.type.id + ': ' + format( it.value ) }}</li>
	</ul>

</div>
</template>