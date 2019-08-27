<script>
export default {
	
	data() {
		return { item:null }
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
		<button @click="confirm">Confirm</button>
		<button @click="cancel">Cancel</button>

	</div>
</template>

<style scoped>

div.popup {
	display:none;
	height:auto;
	min-height:100px;
	min-width:200px;
	max-width:240px;
	position: absolute;
	z-index:20000;
	top:0;
	background:white;
	border: 1.5px solid rgb( 100, 100,100);
	border-radius: 0.20rem;
}

</style>