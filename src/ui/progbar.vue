<script>
export default {

	props:['value', 'max', 'label'],
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
		<div class="fill" v-if="value>0" :style="'width:'+width"></div>
		<div class="fill" v-else>&nbsp;</div>
	</div>
</div>

</template>

<style>
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
