<script>

import ItemsBase from './itemsBase.js';
import game from '../game';

/**
 * @emits [itemover, itemout]
 */
export default {

	props:['items'],
	mixins:[ItemsBase],
	created(){
		this.game = game;
	}

}
</script>


<template>
<div>


	<span :class="{ 'action-btn':true, locked:locked(it),
		'running':it===game.state.curAction, runnable:it.perpetual||it.length>0 }" v-for="it in items" :key="it.id"
		@mouseenter.capture.stop="dispatch( 'itemover', $event,it)">
	<button class="wrapped-btn"
		:disabled="!usable(it)"
		@click.stop="dispatch( 'action', it)">{{ showName(it) }}</button>
	</span>


</div>
</template>