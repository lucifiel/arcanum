export default {

	/**
	 * @property {Object} vars - variables saved to browser.
	 */
	vars: {

		autoSave:true,
		saveTime:30,
		darkMode:false

	},

	load() {

		let str = window.localStorage.getItem( 'gameSettings');

		if ( str ) {

			let data = JSON.parse( str );
			for ( let p in data ) {
				this.vars[p] = data[p];
			}

		}

	},

	save(){

		let store = window.localStorage;
		if ( store ) {

			let json = JSON.stringify( this.vars );
			store.setItem('gameSettings', json );

		}

	}

};