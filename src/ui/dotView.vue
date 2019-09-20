<script>
import { seconds } from '../util/format.js';
import ItemBase from 'ui/itemsBase';

export default {

	props:['dots'],
	mixins:[ItemBase],
	beforeCreate(){
		this.seconds = seconds;
	}

}
</script>

<template>

	<div class="dot-view">

		<div :class="['dot',d.kind]" v-for="d in dots" :key="d.id"
		@mouseenter.capture.stop="dispatch( 'itemover', $event,d)">

			{{ seconds( d.duration ) }}<br>
			{{ d.name }}

			<div v-if="d.kind" class="bgfill" >&nbsp;</div>

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
		max-height:40px;
		margin:0px 2px;
		text-align: center;
		padding:4px;
		border: 1px solid black;
	}

</style>
