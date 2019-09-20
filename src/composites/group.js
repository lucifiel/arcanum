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

		this.items = gs.toData(this.items);

	}

}