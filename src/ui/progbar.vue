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

<div style="container">
	<label v-if="label" :for="elmId('bar')">{{label}}</label>
	<div class="bar" :id="elmId('bar')">
		<div class="fill" :style="'width:'+width">&nbsp;</div>
	</div>
</div>

</template>

<style>
div.container {
display:inline-block;
width:100%;
}
div.bar {
	display:inline-block;
	background: #333;
	margin:4px 4px 0px 2px;
	padding:2px;
	min-height:18px;
	width:-webkit-fill-available;
	width:-moz-available;
	border-radius: 8px;
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
