<script>

const LogTypes = ['event','unlock','combat', 'loot'];

/**
 * Displays event output to user.
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
	methods:{

		clearLog(){ this.log.clear(); }

	},
	computed:{

		visItems(){
			return this.items.filter(v=>!v.type || this.filter.includes(v.type));
		}

	}

}
</script>


<template>

	<div class="log-view">

			<div class="top-span">
				<button type="button" class="inline btn-sm" @click="clearLog">Clear</button>
				<span class="checks">

				<span v-for="p in LogTypes" :key="p">
					<input type="checkbox" :value="p" :id="elmId(p)" v-model="filter" >
					<label :for="elmId(p)">{{ p }}</label>
				</span>
				</span>

			</div>


			<div class="outlog">
			<div class="log-item" v-for="(it,i) in visItems" :key="i">

				<span v-if="it.title" class="log-title">{{ it.title }}</span><br>
				<span class="log-text">{{ it.text }}</span>

			</div>
			</div>

	</div>

</template>

<style scoped>

div.log-view {
	margin-left: 8px;
	flex-direction: column;
	overflow-y: auto;
	flex-basis:20%;
	max-width: 250px;
}

div.top-span {
	display:flex;
	flex-flow: row nowrap;
	margin: 2px 8px 5px;
	padding-bottom: 2px;
	border-bottom: 1px solid rgb(88, 87, 87);

}

span.checks {
	display:flex;
	flex-flow: row wrap;
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
