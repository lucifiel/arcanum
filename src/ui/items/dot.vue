<script>

import Range from '../../range';

export default {

	props:['dot'],
	name:'dot',
	components:{
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

	<hr>
	<div class="note-text">dot:</div>
	<div>
		<div><span>duration: </span><span>{{ dot.duration || 'infinity' }}</span></div>
		<div v-if="dot.damage"><span>dmg: </span><span>{{damage}}</span></div>
		<div v-if="dot.kind"><span>kind: </span><span>{{dot.kind}}</span></div>
	</div>

	<div v-if="dot.effect||dot.mod||dot.result">

			<hr>
			<div class="note-text">effects:</div>

			<div v-for="(obj,key) in [dot.effect,dot.mod,dot.result]" :key="key">

				<div v-for="(v,k) in effectItems(dot, k==='effect')" :key="k">

					<span v-if="typeof v === 'boolean'">{{ k }}</span>
					<span v-else>{{ `${k}: ${v}` }}</span>

				</div>

			</div>

		</div>

</div>

</template>