<script>
/**
 * Bar for quick-use items.
 */
export default {
	props:['state'],
	data(){
		return {
			slots:this.state.quickslots
		}
	},
	methods:{

		remove(it){

			console.log('REMOVING');
			let ind = this.slots.indexOf(it);
			if ( ind >= 0) this.$set( this.slots, ind, undefined );

		}

	},
	computed:{
		hasItems(){ return this.slots.some(v=>v!=null); }
	}

}
</script>

<template>
	<div :class="{quicktop:true, hide:!hasItems }">

		<div class="quickslot" v-for="(it,i) in slots" :key="i">

			<div v-if="it" @click="dispatch('upgrade', it)"
			@mouseenter.capture.stop="dispatch('itemover',$event,it)">
			{{ it.name.slice(0,1) }}
			<div class="remove" @click="remove(it)">&nbsp;</div>

			</div>
		</div>

	</div>
</template>

<style scoped>

div.hide {
	visibility: hidden;
}

div.quicktop {

	display:flex;
	cursor:pointer;
	width:100%;
	flex-direction: row;
}

div.quickslot {
	min-width: 42px;
	min-height:42px;
	margin: 2px 4px;
	padding:2px;
	position:relative;
	font-size:xx-large;
	border: 1px solid rgb(24, 24, 24);
}

div.remove {
	position:absolute;
	top:-8px;
	right:1px;
	font-size: smaller;
}

div.remove::after {
	content:"x";
}

</style>
