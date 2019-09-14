<script>
import Settings from './settings';

export default {

	data(){

		return {
			closed:true
		};
	},
	created() {
		this.listen('open-settings', this.show )
	},
	methods:{

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
	<input type="checkbox" :id="elmId('auto-save')" v-bind="autoSave">
	<button @click="close">close</button>

</div>

</template>

<style scoped>

.hide {
	display:none;
}

.popup {
	height:auto;
	min-height:100px;
	min-width:200px;
	max-width:240px;
	position: absolute;
	z-index:10000;
	top:0;
	background:white;
	border: 1.5px solid rgb( 100, 100,100);
	border-radius: 0.20rem;
	padding: 12px;
}

</style>