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
			<td class="slot-item" v-if="slot.empty()">None</td>
			<td class="slot-item" v-else>

				<div v-if="slot.multi">

					<div v-for="it in slot.item" :key="it.id">
						{{ it.name }}<button @click="dispatch('unequip', slot, it)">Unequip</button>
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

tr.equip-slot {
	margin: 2px 0px;
}

tr.equip-slot {
	height:42px;
}

td.slot-name {
	font-weight: bold;
}

</style>
