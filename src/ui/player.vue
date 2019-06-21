<script>
export default {
	
	props:['player'],
	methods:{
		
	}

}
</script>


<template>

	<div class="player-view">

		<table>
		<tr><td class="prop">name</td><th class="value"> {{ player.name }}</th></tr>
		<tr><td class="prop">title</td><th class="value"> {{ player.title}}</th></tr>
		<tr><td class="prop">level</td><th class="value"> {{ player.level }}</th></tr>
		</table>

	</div>

</template>
