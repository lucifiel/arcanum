import Vue from 'vue';
import Main from 'ui/main.vue';
import Confirm from 'ui/confirm.vue';

/**
 * Global dispatch.
 */
var dispatch = new Vue();

Vue.mixin({

	dispatch:dispatch,
	components:{
		confirm:Confirm
	},
	methods: {

		dispatch( ...args ) {
			dispatch.$emit.apply( dispatch, args );
		},

		listen( evt, func ) {
			dispatch.$on( evt, func );
		},

		// get id for html element.
		elmId(name) { return name + this._uid; }

	}

});

var vm = new Vue({
	el: '#vueRoot',
	components:{ Main },
	render( createElm ) {
		return createElm(Main, { props:{} } );
	}

});