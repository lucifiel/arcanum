<script>

export default {
	
	props:['equip'],
	methods:{

	}

}
</script>


<template>
	<div class="equip">

		<div class="equip-slot" v-for="(slot,p) in equip.slots" :key="p">
			<span class="slot-name">{{ slot.name + ':' }}</span>
			<span class="slot-item" v-if="slot.empty()">None</span>
			<span class="slot-item" v-else>

				<div v-if="slot.multi">

					<div v-for="it in slot.item" :key="it.id">
						{{ it.name }}<button @click="dispatch('unequip', slot, it)">Unequip</button>
					</div>

				</div>
				<div v-else>
					{{ slot.item.name }}<button @click="dispatch('unequip', slot, it )">Unequip</button>
				</div>

			</span>
		</div>

	</div>

</template>

<style scoped>

div.equip {
	display:flex;
	flex-direction: column;
}

div.equip-slot {
	display:inline;
	margin: 2px 0px;
}

span.slot-name {
	display:inline-block;
	font-weight: bold;
}

span.slot-item {
	display: inline-block;
}

</style>
