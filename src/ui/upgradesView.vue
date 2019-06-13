<script>
import { round } from 'format';

export default {
	
	props:['upgrades'],
	data(){
		console.log('this.upgrades: ' + this.upgrades );
		return {
		}
	},
	methods:{
		format:round
	}

}
</script>


<template>
<div class="upgrade-list">

	<ul>
		<li v-for="it in upgrades" :key="it.type.id">{{ it.type.id + ': ' + format( it.value ) }}</li>
	</ul>

</div>
</template>