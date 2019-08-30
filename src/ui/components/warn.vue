<script>
import {center} from './popups.js';

export default {
	
	data() {
		return { item:null }
	},
	updated() {
		if ( this.item ) {
			center( this.$el );
		}
	},
	methods:{
		warn(it){
			this.item = it;
		},
		confirm(){
			let it = this.item;
			this.item = null;
			if ( it ) this.$emit('confirmed', it );

		},
		cancel(){ this.item = null; }

	}

}
</script>

<template>
	<div class="popup" v-if="item!=null">

		<div>{{ item.name }}</div>
		<div>{{item.desc }}</div>
		<div>This action is not reversible. Continue?</div>
		<div>
		<button @click="confirm">Confirm</button>
		<button @click="cancel">Cancel</button>
		</div>

	</div>
</template>

<style scoped>

div.popup {
	height:auto;
	min-height:100px;
	min-width:200px;
	max-width:240px;
	position: absolute;
	z-index:20000;
	left:50%;
	top:20%;
	align-self: center;
	background:white;
	padding:12px;
	border: 1.5px solid rgb( 100, 100,100);
	border-radius: 0.20rem;
}

div.popup div {
	margin:6px 0px;
}

</style>