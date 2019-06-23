<script>
export default {
	
	props:['player'],
	computed:{

		name:{
			get(){
				return this.player.name;
			},
			set(v){
				if ( v ) this.player.name = v;
			}
		}
	},
	methods:{
		
	}

}
</script>


<template>

	<div class="player-view">

		<table>
		<tr><td class="prop">name</td><th class="value">
			<input type="text" v-bind="name"></th></tr>
		<tr><td class="prop">title</td><th class="value"> {{ player.title}}</th></tr>
		<tr><td class="prop">level</td><th class="value"> {{ player.level }}</th></tr>
		</table>

	</div>

</template>
