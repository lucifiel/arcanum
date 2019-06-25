<script>
export default {

	props:['value', 'max', 'label'],
	methods:{

	},
	computed:{
		width(){
			return (100*(this.value/this.max)) + '%;'
		}
	}

}
</script>


<template>

<div style="display:inline-block">
	<label v-if="label" :for="elmId('bar')">{{label}}</label>
	<div class="bar" :id="elmId('bar')">
		<div v-if="value>0" :style="'width:'+width"></div>
		<div v-else>&nbsp;</div>
	</div>
</div>

</template>

<style scoped>
div.bar {
	display:inline-block;
	background: #333;
	margin:4px 4px 0px 2px;
	padding:3px;
	min-height:18px;
	width:200px;
	border-radius: 9px;
}
div.bar > div {
	background:orange;
	border-radius: 7px;
	height:100%;
	min-width:0px;
	width:0px;
}
div.bar>div:after{
	content:"\00a0";
}
</style>
