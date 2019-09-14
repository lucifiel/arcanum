<script>
export default {

	methods:{

		fileDrop(e){
			e.stopPropagation();
			e.preventDefault();

			e.target.classList.remove('hilite');

			const dt = e.dataTransfer;
			this.dispatch('load-file', dt.files);

		},
		fileDrag(e){
			e.stopPropagation();
			e.preventDefault();
			e.currentTarget.classList.add('hilite');
		},
		dragOut(e){
			e.stopPropagation();
			e.preventDefault();
			e.currentTarget.classList.remove('hilite');
		},

	}

}
</script>

<template>

	<div class="top-bar">

		<span>
		<span class="load-opts">
		<button @click="dispatch('save')">save</button>
		<button @click="dispatch('load')">load</button>

		<a class="text-button" id="save-file" href=""
				download @click.self="dispatch('save-file',$event)" type="text/json">Get File</a>
			<!--<input type="file" name="[File]" accept="text/json" @change="fileDrop">-->
		<button id="drop-file" @drop="fileDrop"
			@dragover="fileDrag" @dragleave.capture.stop="dragOut">[Drop File]</button>

			<confirm @confirm="dispatch('reset')">reset</confirm>

		</span>

		<slot name="center"></slot>
		</span>

		<span class="link-bar">
			<button class="text-button" @click="dispatch('open-settings')">&#9881;</button>
			<a href="./changelog.txt" target="_blank">Changes</a>
		</span>

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