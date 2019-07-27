<script>
export default {

	/**
	 * @property {Inventory} inv - the inventory object.
	 */
	props:['inv'],
	methods:{

	}

}
</script>


<template>
<table class="inv item-table">
	<tr v-for="it in inv.items" :key="it.id">
		<td>{{ it.name }}</td>
		<td><button @click="dispatch('equip',it)">Equip</button></td>
		<td><button @click="dispatch('drop',it)">Drop</button></td>
	</tr>
</table>	
</template>


<style scoped>

.inv {
	margin-left: 48px;
	width:auto;
	overflow-y:auto;
	max-height:93vh;
}


</style>