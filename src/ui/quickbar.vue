<script>
/**
 * Bar for quick-use items.
 */
export default {
	props:['slots'],
	/*data(){
		return {
			slots:this.state.quickslots
		}
	},*/
	methods:{

		remove(ind){

			if ( ind >= 0) this.$set( this.slots, ind, undefined );

		}

	},
	computed:{

		hasItems(){ return this.slots.some(v=>v!=null); }

	}

}
</script>

<template>
	<div class="quickbar" v-if="hasItems">

		<div class="quickslot" v-for="(it,i) in slots" :key="i">

			<div v-if="it!=null" :class="it.school ? it.school :''"
					@click="dispatch('action', it)"
					@mouseenter.capture.stop="dispatch('itemover',$event,it)">

				
				<div>{{ it.name.slice(0,1) }}</div>

				<div class="remove" @click="remove(i)" />
				<div v-if="it.school" class="bgfill" >&nbsp;</div>

			</div>
			<div v-else>{{ (i != 9) ? i + 1 : 0 }}</div>

		</div>

	</div>
	<div class="quickbar" v-else>

		<p class="use-msg">
			Roll-over Item and press {Shift} + {Number} to assign quickslot.<br>
			Press {Number} again to use quickslot Item.
		</p>

	</div>

</template>

<style scoped>

p.use-msg {
	font-size:20px;
	line-height: 1.4em;
	margin-left: 10%;
}

div.quickbar {

	display:flex;
	cursor:pointer;
	width:100%;
	flex-direction: row;
	position:fixed;
	bottom: 8px;
	left: 8px;
}

div.quickslot {
	min-width: 52px;
	min-height:52px;
	margin: 2px 6px 4px 4px;
	padding:2px;
	text-align: center;
	/** relative so remove button correctly placed. **/
	position: relative;
	font-size:xx-large;
	border: 1px solid #181818;
}

div.remove {
	position:absolute;
	border: 1px solid #181818;
	top:0px;
	right:0px;
	margin: 0px;
	padding: 0px;
	background:white;
	z-index: 10;
	min-height:12px;
	min-width: 12px;
	font-size: 0.8rem;
}

div.remove::after {
	content:"x";
}

</style>
