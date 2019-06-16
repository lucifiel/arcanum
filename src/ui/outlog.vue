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
	
	<div class="outlog">

		<ul class="log">

			<li v-for="(it,i) in log.items" :key="i">
				<span class="log-title">{{ it.title }}</span><br>
				<span class="log-text">{{ it.text }}</span>
			</li>
		</ul>
	</div>

</template>
