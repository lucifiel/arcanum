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
			{{ seconds( d.duration ) }}<br>
			{{ d.name }}
		</div>

	</div>

</template>

<style scoped>

	div.dot-view {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	div.dot {
		margin:0px 2px;
		text-align: center;
		padding:4px;
		border: 1px solid black;
	}

</style>
