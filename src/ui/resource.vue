<script>
// PERFORMANCE OF USING SUB-RESOURCE COMPONENT IS WORSE.

/*import { round } from 'format';

export default {
	
	props:['res'],
	methods:{
		round:round
	},
	computed: {

		cssClass(){
			return {'item-name':true, locked:this.res.locked };
		},

		locked() {
			return this.res.locked !== false || this.res.disabled === true || this.res.locks > 0;
		},

		value(){return round( this.res.value); },

		maxStr() { return ( this.res.max && this.res.max.value > 0 ? '/' + round(this.res.max.value) : '' ); },

		delta(){
			return this.res.delta != 0 ? ' (' + this.res.delta.toFixed(2) + '/t )' : '';
		}

	}

}
*/
</script>


<template>

	<tr :class="cssClass"
		@mouseenter.capture.stop="dispatch('itemover',$event,res)">

		<td>{{ res.name }}</td>
		<td>{{ value + maxStr }}</td>
		<td>{{ delta }}</td>

	</tr>


</template>