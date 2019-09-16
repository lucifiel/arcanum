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

		<span class="load-opts">
		<button @click="dispatch('save')">save</button>
		<button @click="dispatch('load')">load</button>

		<a class="text-button" id="save-file" href=""
				download @click.self="dispatch('save-file',$event)" type="text/json">get file</a>
			<!--<input type="file" name="[File]" accept="text/json" @change="fileDrop">-->
		<button id="drop-file" @drop="fileDrop"
			@dragover="fileDrag" @dragleave.capture.stop="dragOut">[Drop File]</button>

			<confirm @confirm="dispatch('reset')">reset</confirm>

		<span class="items"><slot name="center"></slot></span>

		</span>

		<span class="link-bar">
			<button class="text-button" @click="dispatch('open-settings')">&#9881;</button>
			<a href="https://discord.gg/n5XUKE9" target="_blank">discord</a>
			<a href="https://www.paypal.me/lerpinglemur" target="_blank">donate</a>
			<a href="https://www.reddit.com/r/wizrobe/" target="_blank">feedback</a>
			<a href="./changelog.txt" target="_blank">changes</a>
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

.top-bar .items {
	display:flex;
	margin-left:20px;
}

.load-opts {
	display:flex;
}

div.top-bar {
	display:flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	align-content: center;
	min-height:52px;
	max-width:100%;
	padding: 0px 14px 4px;
	border-bottom: 1px solid rgb(216, 216, 216);
}

.link-bar {
	display:flex;
	flex-flow: row-reverse nowrap;
	font-size: 0.90em;
}

.link-bar a {
	margin:0px 10px 4px;
	align-self:center;
}

span.load-message {
	padding: 8px 8px 2px;
}

</style>