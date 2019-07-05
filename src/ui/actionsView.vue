<script>

import ItemsBase from './itemsBase.js';

/**
 * @emits [itemover, itemout]
 */
export default {

	mixins:[ItemsBase],
	methods:{
	}

}
</script>


<template>
<div class="action-list">

	<span :class="{ 'action-btn':true, locked:locked(it) }" v-for="it in items" :key="it.id"
		@mouseenter.capture.stop="dispatch( 'itemover', $event,it)">
	<button class="wrapped-btn"
		:disabled="!usable(it)"
		@click.stop="dispatch( 'action', it)">{{ it.name || it.id }}</button>
	</span>

</div>
</template>