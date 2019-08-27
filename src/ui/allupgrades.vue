<script>
import Game from '../game';

export default {
	
	computed:{
		classes() {
			return Game.state.classes.filter(v=>!v.disabled&&v.value>=1);
		},
		actions() {
			return Game.state.actions.filter(v=>!v.repeat&&!v.disabled&&v.value>=1);
		},
		upgrades(){
			return Game.state.upgrades.filter(v=>!v.disabled&&v.value>=1);
		}
	}

}
</script>


<template>
<div class="up-list">
	<div class="div-hr">upgrades</div>
	<div v-for="it in classes" :key="it.id" @mouseenter.capture.stop="dispatch( 'itemover', $event,it)">
		{{it.name}}
	</div>
	<div v-for="it in actions" :key="it.id" @mouseenter.capture.stop="dispatch( 'itemover', $event,it)">
		{{it.name}}
	</div>
	<div v-for="it in upgrades" :key="it.id" @mouseenter.capture.stop="dispatch( 'itemover', $event,it)">
		{{it.name}}
	</div>

</div>	
</template>

<style scoped>

div.up-list {
	overflow-y: auto;
	overflow-x:visible;
	width: 100%;
}

</style>