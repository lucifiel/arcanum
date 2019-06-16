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
	}

}
</script>


<template>
<div class="action-list">

	<button :class="{'action-btn':true, locked:locked(it) }" v-for="it in items" :key="it.id"
		:disabled="!usable(it)" @click="click(it)">{{ it.name || it.id }}</button>

</div>
</template>