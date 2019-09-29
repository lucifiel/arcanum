<script>
import { seconds, abbr } from '../util/format.js';
import ItemBase from 'ui/itemsBase';

export default {

	props:['dots', 'mini'],
	mixins:[ItemBase],
	beforeCreate(){
		this.seconds = seconds;
		this.abbtr = abbr;
	}

}
</script>

<template>

	<div class="dot-view">

		<div :class="['dot',d.kind, d.school, mini ? 'mini':'']" v-for="d in dots" :key="d.id"
		@mouseenter.capture.stop="dispatch( 'itemover', $event,d)">

			{{ Math.ceil( d.duration ) }}
			<span v-if="!mini"><br>{{ abbr( d ) }}</span>

			<div v-if="d.kind||d.school" class="bgfill" >&nbsp;</div>

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

	div.mini {
		max-height:24px;
		max-width: 24px;
		padding:0;
	}

</style>
