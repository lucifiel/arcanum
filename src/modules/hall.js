import CharInfo from "./charinfo";
import Stat from "../values/stat";

/**
 * Wizards hall.
 */
export default class Hall {

	toJSON(){

		return {

			name:this.name,
			chars:this.chars,
			active:this.active

		}

	}

	/**
	 * @property {number} active - slot of active char.
	 */
	get active() { return this._active; }
	set active(v) { this._active = v;}

	/**
	 * @property {string} name - name of hall.
	 */
	get name() { return this._name; }
	set name(v) { this._name = v; }

	get chars() { return this._chars; }
	set chars(v) {

		console.warn('CHARS IS ARRAY? ' + Array.isArray(v) );

		for( let i = v.length-1; i >= 0; i-- ) {
			v[i] = new CharInfo(v[i]);
		}

		this._chars = v;
	}

	/**
	 * @property {number} max - maximum char slots.
	 */
	get max() {return this._max; }
	set max(v) {

		this._max = v instanceof Stat ? v : new Stat(v);

	}

	constructor(vars=null ){

		if ( vars ) Object.assign(this, vars);

		if ( !this.chars ) this.chars = [];
		if ( !this.active ) this.active = 0;

		/** @todo: change default to 1 */
		if ( !this.max ) this.max = 2;

		let max = this.max.value;
		// expand chars to max.
		for( let i = this.chars.length; i < max; i++ ) {
			this.chars.push( new CharInfo() );
		}

	}

	/**
	 * Player data loaded. Copy information into the active slot.
	 * @param {*} p
	 */
	playerLoaded( p ) {

		let char = this.chars[ this.active ] || new CharInfo();
		char.name = p.name;
		char.level = p.level;
		char.title = p.title;

	}

	addChar( info, slot=-1 ) {

		if ( !slot ) slot = this.active;
		this.chars[ info.name ] = info;

	}

	setLevel( lvl, slot=-1 ){

		let char = this.getSlot(slot);
		if ( char) char.level = lvl;

	}

	setName(name, slot=-1 ){

		let char = this.getSlot(slot);
		if ( char) char.name = name;

	}

	setTitle( title, slot=-1 ){
		let char = this.getSlot(slot);
		if ( char) char.title = title;
	}

	setInfo( info, slot=-1 ){

		slot = slot > 0 ? slot : this.active;

	}

	getSlot(slot=-1) {
		return this.chars[ slot < 0 ? this.active : slot ];
	}

	findSlot(p) {
		return this.chars.findIndex(p);
	}

	/**
	 * Get slot index by name.
	 * @param {string} charName
	 * @returns {number}
	 */
	byName( charName ) {
		return this.chars.findIndex( v=>v.name === charName);
	}

	rmChar( slot ) {
		this.chars[ slot ] = undefined;
	}

}