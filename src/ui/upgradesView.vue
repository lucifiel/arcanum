<script>
import ItemsBase from './itemsBase.js';
import Game from '../game';

export default {

	mixins:[ItemsBase],
	data(){

		this.pLayout = this.layout || 'upgrade-list';
		return {
		}
	},
	methods:{
	}

}
</script>


<template>
<div :class="{[pLayout]:true}">

	<span :class="{'action-btn':true, locked:locked(it) }" v-for="it in items" :key="it.id"
		@mouseenter.capture.stop="dispatch( 'itemover', $event,it)"
		@mouseleave.capture.stop="dispatch( 'itemout', $event)">

	<button
		class="wrapped-btn"
		:disabled="!usable(it)"
		@click.stop="dispatch( 'upgrade', it)">{{ it.name || it.id }}</button>
	</span>

</div>
</template>