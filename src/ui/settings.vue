<script>
import Settings from '../settings';

import { center } from './components/popups';

export default {

	data(){

		return {
			closed:true
		};
	},
	updated() {

		if (!this.closed) center(this.$el);
	},
	created() {
		this.listen('open-settings', this.show );
		Settings.load();
	},
	methods:{

		close() {
			Settings.save();
			this.closed = true;
		},

		show() {
			this.closed = false;
		}

	},
	computed:{

		autoSave:{
			get(){
				return Settings.vars.autoSave;
			},
			set(v){
				Settings.vars.autoSave = v;
				this.dispatch('setting', 'autoSave', v );
			}
		}
	}

}
</script>

<template>

<div :class="['settings', 'popup', closed ? 'hide' : '']">

	<label :for="elmId('auto-save')">auto-save</label>
	<input type="checkbox" :id="elmId('auto-save')" v-model="autoSave">
	<button class="close" @click="close">close</button>

</div>

</template>

<style scoped>

button.close {
	position:absolute;
	bottom: 10px;
	right:10px;
}


.hide {
	display:none;
}

.popup {
	height:auto;
	min-height:200px;
	min-width:300px;
	max-width:440px;
	position: absolute;
	z-index:10000;
	top:120px;
	background:white;
	border: 1.5px solid rgb( 100, 100,100);
	border-radius: 0.20rem;
	padding: 12px;
}

</style>