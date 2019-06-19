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

	<button :class="{'action-btn':true, locked:locked(it) }" v-for="it in items" :key="it.id"
		:disabled="!usable(it)"
		@mouseover.stop="mouseover($event,it)"
		@mouseout.stop="mouseout($event)"
		@click.stop="click(it)">{{ it.name || it.id }}</button>

</div>
</template>