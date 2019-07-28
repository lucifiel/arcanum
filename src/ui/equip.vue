<script>

export default {
	
	props:['equip'],
	methods:{

	}

}
</script>


<template>
	<table class="equip">

		<tr class="equip-slot" v-for="(slot,p) in equip.slots" :key="p">
			<td class="slot-name">{{ slot.name + ':' }}</td>
			<td class="slot-item" v-if="slot.empty()"></td>
			<td class="slot-item" v-else>

				<div v-if="slot.multi">

					<div v-for="it in slot.item" :key="it.id">
						<span class="item-name">{{ it.name }}</span> <button @click="dispatch('unequip', slot, it)">Unequip</button>
					</div>

				</div>
				<div v-else>
					{{ slot.item.name }}<button @click="dispatch('unequip', slot, slot.item )">Unequip</button>
				</div>

			</td>
		</tr>

	</table>

</template>

<style scoped>

.equip {
	height:auto;
}

tr.equip-slot {
	margin: 2px 0px;
}

tr.equip-slot button {
	margin-left: 10px;
	padding: 6px;
}

td.slot-item {
	min-width: 42px;
}
tr.equip-slot {
	height:42px;
}

td.slot-name {
	font-weight: bold;
}

</style>
