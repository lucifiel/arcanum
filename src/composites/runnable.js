
/**
 * Wraps an action in progress with an action target, and possible
 * extra instance data.
 */
export default class Runnable {

	toJSON(){
	}

	/**
	 * @property {Item} target - ultimate target of Runner.
	 */
	get target() { return this._target;}
	set target(v) { this._target = v; }

	/**
	 * @property {Item} item - item being run.
	 */
	get item() { return this._item; }
	set item(v) { this._item = v; }

	get progress(){ return this._progress; }
	set progress(v) { this._progress=v;}

	get length() { return this._item.length || 0; }

	constructor( vars=null) {

		if (vars) Object.assign( this, vars);

	}

	revive( state ) {

		if ( typeof this._item === 'string') this._item = state.getItem(this._item);
		if ( typeof this._target === 'string') this._target = state.getItem(this._target);

	}

}