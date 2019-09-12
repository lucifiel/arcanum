<script>
import Game from '../game';

export default {

	methods:{

		count(it){
			return it.value > 1 ? ( ' (' + Math.floor(it.value) + ')' ) : '';
		}
	},
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
		{{it.name + count(it) }}
	</div>
	<div v-for="it in actions" :key="it.id" @mouseenter.capture.stop="dispatch( 'itemover', $event,it)">
		{{it.name + count(it) }}
	</div>
	<div v-for="it in upgrades" :key="it.id" @mouseenter.capture.stop="dispatch( 'itemover', $event,it)">
		{{it.name + count(it) }}
	</div>

</div>
</template>

<style scoped>

div.up-list {
	padding-right:14px;
	overflow-y: auto;
	overflow-x:visible;
}

</style>