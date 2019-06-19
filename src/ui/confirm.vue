<script>
export default {
	
	props:['confirm','cancel'],
	data(){
		return {
			btnConfirm:this.confirm||'Confirm',
			btnCancel:this.cancel||'Cancel',
			confirming:false
		};
	},
	methods:{

		/**
		 * @public
		 * Resets the confirm dialog when the Confirm prompt
		 * is no longer applicable.
		 */
		reset() {
			this.confirming = false;
		},
		mainClick(){
			this.confirming=true;
			this.$emit( 'click' );
		},
		confirmClick(){
			this.confirming = false;
			this.$emit( 'confirm' );
		},
		cancelClick(){
			this.confirming=false;
			this.$emit( 'cancel' );
		}

	}

}
</script>


<template>
	<div v-if="confirming">
		<button type="button" @click="confirmClick">{{btnConfirm}}</button>
		<button type="button" @click="cancelClick">{{btnCancel}}</button>
	</div>
	<div v-else>
		<button type="button" @click="mainClick"><slot>Delete</slot></button>
	</div>

</template>
