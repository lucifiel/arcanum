<script>

export default {

	props:['active', 'items'],
	data(){
		return {
			cur:this.active
		};
	},
	methods:{

		itemTitle(it) {

			if ( it instanceof Object ) {
				return it.name || it.desc || it.id;
			} return it;

		},

		itemId(it){
			if ( it instanceof Object ) {
				return it.id;
			}
			return it;
		},

		setActive( it ) {

			this.cur = it;
			this.$emit( 'changed', it );

		}

	}

}

</script>

<template>
	<div class="menu">

		<div class="menu-items">

		<div class="menu-item" v-for="(it) in items" :key="it.id">
			
			<span v-if="it !== cur" @click="setActive(it)" :key="itemTitle(it)"> <u> {{ itemTitle(it) }} </u></span>
			<span v-else :key="itemTitle(it)"> {{ itemTitle(it) }} </span>

		</div>
			<slot>
		</slot>

		</div>


		<!-- NOTE: slot css-class ignored -->
		<slot :name="itemId(cur)"></slot>

	</div>
</template>
