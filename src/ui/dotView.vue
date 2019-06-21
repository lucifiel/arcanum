<script>
import { seconds } from '../format.js';

export default {
	
	props:['dots'],
	beforeCreate(){
		this.seconds = seconds;
	}
}
</script>

<template>
	
	<div class="dot-view">

		<div class="dot" v-for="d in dots" :key="d.id">
			{{ d.name }}
			{{ seconds( d.duration ) }}
		</div>

	</div>

</template>
