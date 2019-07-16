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
<div class="inv">
	<div v-for="it in inv.items" :key="it.id">
		<span>{{it.name}}</span>
		<button @click="dispatch('equip',it)">Equip</button>
		<button @click="dispatch('drop',it)">Drop</button>
	</div>
</div>	
</template>


<style scoped>

div.inv {
	display:flex;
	flex-direction: column;
	overflow-y:auto;
	height:0.95vh;
}
</style>