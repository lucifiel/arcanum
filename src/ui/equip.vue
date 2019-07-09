<script>
export default {
	
	props:['equip'],
	methods:{

	},
	computed:{

	}

}
</script>


<template>
	<div class="equip">

		<div v-for="(slot,p) in equip.slots" :key="p">
			{{ slot.name + ':' }}
			<div v-if="slot.empty()">None</div>
			<div v-else>

				<div v-if="slot.multi()">

					<div v-for="it in slot.item" :key="it.id">
						{{ it.name }}<button @click="dispatch('unequip', slot, it)">Unequip</button>
					</div>

				</div>
				<div v-else>
					{{ slot.item.name }}<button @click="dispatch('unequip', slot, it )">Unequip</button>
				</div>

			</div>
		</div>

	</div>

</template>

<style scoped>

</style>
