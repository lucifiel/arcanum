
<script>
export default {

}
</script>

<template>

	<div class="top-bar">

		<span class="load-opts">
		<button @click="dispatch('save')">save</button>
		<button @click="dispatch('load')">load</button>

		<a class="text-button" id="save-file" href=""
				download @click.self="dispatch('save-file',$event)" type="text/json">Get File</a>
			<!--<input type="file" name="[File]" accept="text/json" @change="fileDrop">-->
		<button id="drop-file" @drop="fileDrop"
			@dragover="fileDrag" @dragleave.capture.stop="dragOut">[Drop File]</button>

			<confirm @confirm="dispatch('reset')">reset</confirm>
			<span class="load-message" v-if="!state">LOADING DATA...</span>
		</span>

		<dots v-if="state" :dots="state.player.dots" />
		<span class="link-bar"><a href="./changelog.txt" target="_blank">Changes</a></span>
	</div>


</template>

<style scoped>

#save-file {
	text-decoration: none;
}
#drop-file {
	border: 1.75px dashed rgb(117, 117, 117);
}

div.top-bar {
	display:flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	max-width:100%;
	margin:0px 14px;
}

.link-bar {
	display:flex;
	flex-flow: row-reverse nowrap;
	color: rgb(22, 22, 22);
	font-size: 0.90em;
}

.link-bar a {
	color: rgb(22, 22, 22);
}

</style>