import Game from '../game';

/**
 * Wraps an action in progress with an action target, and possible
 * extra instance data.
 */
export default class Runnable {

	toJSON(){

		return {
			item:this.item ? this.item.id : undefined,
			target:this.target ? this.target.id : undefined,
			type:this.type
		};
	}

	get type() { return 'runnable'; }
	set type(v) {}

	/**
	 * @property {?Item} target - target of the running item.
	 * may be undefined if not applicable.
	 */
	get target() { return this._target;}
	set target(v) { this._target = v; }

	/**
	 * @property {Item} item - item being run.
	 */
	get item() { return this._item; }
	set item(v) { this._item = v; }

	/**
	 * @property {string} id - maybe a bad idea.
	 */
	get id() { return this.item.id; }

	/**
	 * @property {string} name
	 */
	get name() { return this.item.name; }

	get cost() { return this.item ? this.item.cost : null; }
	get run() { return this.item ? this.item.run : null; }
	get effect() { return this.item ? this.item.effect : null; }

	get progress(){ return this._item.progress; }
	set progress(v) {

		if ( v > this.item.length ) {
			Game.useWith( this.item, this.target );
			Game.setAction(null);
		}

		this.item.progress = v;

	}

	percent() { return this.item.percent(); }
	maxed() { return this.item.maxed(); }

	get length() { return this._item.length || 0; }
	constructor( vars=null) {

		if (vars) Object.assign( this, vars);

	}

	revive( state ) {

		if ( typeof this._item === 'string') this._item = state.findData(this._item);
		if ( typeof this._target === 'string') this._target = state.findData(this._target);

	}

}