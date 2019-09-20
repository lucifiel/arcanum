export default class Group {

	get items() { return this._items; }
	set items(v) { this._items = v;}

	constructor(vars=null ) {

		if( vars) Object.assign( this, vars );

	}

	canPay() {
	}

	exec() {
	}

	/**
	 *
	 * @param {GameState} gs
	 */
	revive(gs){

		for( let i = this._items.length-1; i>=0;i--){

			var it = this._itesm[i];
			if ( typeof it ==='string') this._items[i] = gs.getData(it);

		}

	}

}