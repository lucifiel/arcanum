<script>
import { round } from 'format';
import Game from '../game';

export default {
	
	props:['resources'],
	data(){
		return {
		}
	},
	methods:{
		format:round,

		locked(res) {
			//return !res || !( res.unlocked || Game.tryUnlock(res) );
			return !res || ( res.locked && !Game.tryUnlock(res) );
		}

	}

}
</script>


<template>
<div class="resource-list">

	<ul>
		<li :class="{'item-name':true, locked:locked(it)}" v-for="it in resources" :key="it.id">{{ it.name + ': ' + format( it.value ) }}</li>
	</ul>

</div>
</template>