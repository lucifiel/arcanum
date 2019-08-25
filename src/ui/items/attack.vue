<script>
import Range from '../../range';

export default {

	props:['item'],
	name:'attack',
	computed:{

		damage(){

			let dmg = this.item.damage;
			if( typeof dmg === 'number') return dmg;
			else if ( dmg instanceof Range ) return dmg.toString();

		}

	}

}
</script>

<template>

<div class="attack">

	<div>hit bonus: {{ item.tohit || 0 }}</div>
	<div v-if="item.hands>1">Two Handed</div>
	<div class="damage" v-if="damage">damage: {{ damage }}</div>
	<div>kind: {{ item.kind }}</div>
	<div v-if="item.dot">


	</div>

</div>

</template>