<script>
/**
 * Displays output to user.
 */
export default {

	props:['log'],
	data() {

		return {
			items:this.log.items,
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

		<ul>

			<li class="log-item" v-for="(it,i) in items" :key="i">
				<span class="log-title">{{ it.title }}</span><br>
				<span class="log-text">{{ it.text }}</span>
			</li>
		</ul>
	</div>

</template>

<style scoped>
div.outlog {
	flex-direction: column;
}

div.log-item {
	display:flex;
	flex-direction: column;
}

.log-title {
	font-weight: bold;
}

.log-text {
	font-weight: normal;
	text-align: right;
	align-self: flex-end;
}

</style>
