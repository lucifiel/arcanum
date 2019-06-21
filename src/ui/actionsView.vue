<script>

import ItemsBase from './itemsBase.js';

import Game from '../game';


export default {

	mixins:[ItemsBase],
	data(){
		return {
		}
	},
	methods:{
		childEvent(){
			console.log('CHILD event');
		}
	}

}
</script>


<template>
<div class="action-list">

	<span :class="{ 'action-btn':true, locked:locked(it) }" v-for="it in items" :key="it.id"
		@mouseenter.capture.stop="itemover($event,it)"
		@mouseleave.capture.stop="itemout($event)">
	<button class="wrapped-btn"
		@mouseenter="childEvent"
		@mouseleave="childEvent"
		:disabled="!usable(it)"
		@click.stop="click(it)">{{ it.name || it.id }}</button>
	</span>

</div>
</template>