<script>
export default {

	/**
	 * @property {object[]} items - items to filter.
	 * @property {prop} [prop='name'] - target prop of filter test.
	 */
	props:['value', 'items', 'prop'],
	data() {
		return {
			text:'',
			pprop:this.prop||'name'
		}
	},
	created(){
		this.findText = this.text;
	},
	computed:{

		findText:{

			get() { return this.text; },
			set(v){

				this.text = v;

				let p = this.pprop;

				if ( !v ) this.$emit( 'input', this.items );
				else this.$emit( 'input', this.items.filter(
					it=>(typeof it === 'object') &&
					( (typeof it[p]) === 'string' ) && it[p].includes( v )
				));

			}

		}

	}

}
</script>


<template>
	<div class="filter-box">
		<label :for="elmId('filter')">Find</label>
		<input :id="elmId('filter')" v-model="findText" type="text">
	</div>
</template>


<style scoped>
div.filter-box {
	font-size: 105%;
	vertical-align: middle;
	line-height: 1.2em;
	margin: 8px 4px 8px 12px;
}

.filter-box input[type=text] {
	padding: 4px;
	font-size: 105%;
}
</style>