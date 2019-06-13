<script>
/**
 * Displays output to user.
 */
export default {

	props:['log'],
	data() {

		return {
			/**
			 * @property {string[]} exclude - types to exclude.
			 */
			exclude:[]
		}

	},

	methods:{

		addItem(){

		}
	}

}
</script>


<template>
	
	<div class="output">

		<ul class="log">

			<li v-for="(it,i) in log.items" :key="i">{{ it.title }} {{ it.text }}</li>
		</ul>
	</div>

</template>
