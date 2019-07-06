<script>
import ItemsBase from './itemsBase.js';
import Game from '../game';

export default {

	/**
	 * @property {string} event - name of event to fire when an item is selected.
	 */
	props:['pickEvent'],
	mixins:[ItemsBase],
	created(){

		this.pEvent = this.pickEvent || 'upgrade';
		/*return {
			pEvent:this.pickEvent || 'upgrade',
			pLayout:this.layout||'upgrade-list'
		};*/

	}

}
</script>


<template>
<div class="upgrade-list">

	<span :class="{'action-btn':true, locked:locked(it) }" v-for="it in items" :key="it.id"
		@mouseenter.capture.stop="dispatch( 'itemover', $event,it)">

	<button
		class="wrapped-btn"
		:disabled="!usable(it)"
		@click.capture.stop="dispatch( pEvent, it)">{{ it.name || it.id }}</button>
	</span>

</div>
</template>