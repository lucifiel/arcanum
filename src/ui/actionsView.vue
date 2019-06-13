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

		format:round,
		click( act ){

			this.$emit( 'click', act );

		}

	}

}
</script>


<template>
<div class="action-list">

	<button class="action-button" v-for="it in actions" :key="it.id" @click="click(it)">{{ it.name || it.id }}</button>

</div>
</template>