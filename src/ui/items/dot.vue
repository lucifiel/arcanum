<script>

import Attack from './attack.vue';

import Range from '../../range';

export default {

	props:['dot'],
	name:'dot',
	components:{
		attack:Attack
	},
	computed:{

		damage(){

			let dmg = this.dot.damage;
			if( typeof dmg === 'number') {
				return dmg;
			} else if ( dmg instanceof Range ) return dmg.toString();

		}

	}

}
</script>

<template>

<div class="dot">

	<attack v-if="dot.attack" :item="dot.attack" />

	<div v-if="dot.effect||dot.mod||dot.result">

			<hr>
			<div class="note-text">effects:</div>

			<div v-for="(obj,key) in [dot.effect,dot.mod,dot.result]" :key="key">

				<div v-for="(v,k) in effectItems(obj)" :key="k">

					<span v-if="typeof v === 'boolean'">{{ k }}</span>
					<span v-else>{{ `${k}: ${v}` }}</span>

				</div>

			</div>

		</div>

</div>

</template>