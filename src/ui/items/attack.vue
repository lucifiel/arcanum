<script>
import Range from '../../range';

export default {

	props:['item'],
	name:'attack',
	components:{
		gdata:() => import('./gdata.vue')
	},
	computed:{

		damage(){

			let dmg = this.item.damage;
			if( typeof dmg === 'number') return dmg;
			else if ( dmg instanceof Range ) return dmg.toString();
			else if ( dmg ) {
				//console.log('unknown damage:' + this.item.damage );
				//console.log( typeof this.item.damage );
				//console.log( this.item.damage.min);
			}

		}

	}

}
</script>

<template>

<div class="attack">

	<div>hit bonus: {{ item.tohit || 0 }}</div>
	<div v-if="item.hands>1">Two Handed</div>
	<div class="damage" v-if="damage!==null">damage: {{ damage }}</div>
	<div>kind: {{ item.kind }}</div>
	<gdata v-if="item.dot" :item="item.dot" />

</div>

</template>