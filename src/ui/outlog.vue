<script>

const LogTypes = ['event','unlock','combat'];

/**
 * Displays output to user.
 */
export default {

	props:['log'],
	data() {

		return {
			LogTypes:LogTypes,
			filter:LogTypes.concat(),
			items:this.log.items,
			/**
			 * @property {string[]} exclude - types to exclude.
			 */
		}

	},
	computed:{

		visItems(){
			return this.items.filter(v=>!v.type || this.filter.includes(v.type));
		}

	}

}
</script>


<template>
	
	<div class="outlog">

			<span class="check-span" v-for="p in LogTypes" :key="p">
				<input type="checkbox" :value="p" :id="elmId(p)" v-model="filter" >
				<label :for="elmId(p)">{{ p }}</label>
			</span>

			<div class="log-item" v-for="(it,i) in visItems" :key="i">

				<span v-if="it.title" class="log-title">{{ it.title }}</span><br>
				<span class="log-text">{{ it.text }}</span>



			</div>

	</div>

</template>

<style scoped>
span.check-span {
	margin: 2px 4px;
}

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
