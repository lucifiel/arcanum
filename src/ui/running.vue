<script>
import Game from '../game';
import Runner from '../modules/runner';

export default {

	methods:{

		actionStr( a ){
			return (a.verb || a.name) +
				( ( a.length ) ? ' ' + a.percent().toFixed(0) + '%': '' );
		}

	},
	computed:{

		runner(){return Runner; }

	}

}
</script>

<template>

<div class='running'>

	<div v-for="v in runner.actives" :key="v.id">
		<span>{{ actionStr(v) }}</span>
	</div>

</div>

</template>

<style scoped>

div.running {
	display:flex;
	flex-flow: column nowrap;
}

</style>