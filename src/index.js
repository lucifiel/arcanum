import Vue from 'vue';
import Main from 'ui/main.vue';

import Game from './game';

/**
 * Global dispatch.
 */
var dispatch = new Vue();

Vue.mixin({

	dispatch:dispatch,
	components:{
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


Game.init();

var vm = new Vue({
	el: '#vueRoot',
	components:{ Main },
	render( createElm ) {
		return createElm(Main, { props:{ game:Game } } );
	}

});