<script>

export default {

	props:['active', 'items'],
	data(){
		return {
			cur:this.active
		};
	},
	methods:{

		setActive( name ) {

			this.cur = name;
			this.$emit( 'changed', name );

		}

	}

}

</script>

<template>
	<div class="menu">

		<div class="menu-items">

		<div class="menu-item" v-for="(it) in items" :key="it.id">
			
			<span v-if="it !== cur" @click="setActive(it)" :key="it"> <u> {{ it }} </u></span>
			<span v-else :key="it"> {{ it }} </span>

		</div>
			<slot>
		</slot>

		</div>


		<!-- NOTE: slot css-class ignored -->
		<slot :name="cur"></slot>

	</div>
</template>
