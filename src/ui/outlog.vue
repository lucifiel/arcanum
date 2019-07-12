<script>

const LogTypes = ['story','unlock','combat'];

/**
 * Displays output to user.
 */
export default {

	props:['log'],
	data() {

		return {
			filter:LogTypes.concat(),
			items:this.log.items,
			/**
			 * @property {string[]} exclude - types to exclude.
			 */
			exclude:[]
		}

	}

}
</script>


<template>
	
	<div class="outlog">

			<div class="log-item" v-for="(it,i) in items" :key="i">
				<span class="log-title">{{ it.title }}</span><br>
				<span class="log-text">{{ it.text }}</span>
			</div>

	</div>

</template>

<style scoped>
div.outlog {
	flex-direction: column;
	height:95vh;
	flex-basis: 20%;
	overflow-y: auto;
}

div.log-item {
	display:flex;
	flex-direction: column;
	margin: 8px 0px;
}

.log-title {
	font-weight: bold;
}

.log-text {
	font-weight: normal;
}

</style>
