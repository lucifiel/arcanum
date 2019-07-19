import Stat from "../stat";
import Resource from "../items/resource";
import Range from '../range';
import Item from "../items/item";

/**
 * @constant {number} EXP_RATE
 */
const EXP_RATE = 0.05;

export default class Player extends Item {

	get name() { return this._name; }
	set name(v) { this._name = v;}

	get level() { return this._level; }
	set level(v) { this._level=-v;}

	get title() { return this._title; }
	set title(v) { this._title =v;}

	get exp(){ return this._exp; }
	set exp(v) {

		if ( this._exp === undefined ) this._exp = v;
		else {

			this._exp.value = v;
			if ( this._next > 0 && this._exp.value >= this._next ) this.levelUp();

		}
	}

	/**
	 * @property {number} next - exp to level up.
	 */
	get next() { return this._next; }
	set next(v) { this._next = v;}

	get hp() { return this._hp; }
	set hp(v) {

		if ( this._hp ) this._hp.value = v;
		else if ( v instanceof Resource ) this._hp = v;
		else this._hp = new Resource( {value:v} );

	}

	get defense() { return this._defense; }
	set defense(v) { this._defense =v; }

	get tohit() { return this._tohit; }
	set tohit(v) { this._tohit = v; }

	get speed() { return this._speed; }
	set speed(v) {

		if ( this._speed ) this._speed.value = Number(v);
		else if ( v instanceof Resource ) this._speed = v;
		else this._speed = new Resource( {value:v} );

		this._delay = 10/this._speed.value;

	}

	/**
	 * @property {number} delay - time between attacks.
	 */
	get delay() { return this._delay; }

	/**
	 * NOTE: Elements that are items in themselves are not encoded.
	 */
	toJSON() {

		let data = super.toJSON();

		data.defense = ( this.defense );
		data.tohit = ( this.tohit );
		data.level = ( this.level );
		data.title = ( this.title );
		data.name = ( this.name );

		data.next = ( this.next );
		// attack timer.
		data.timer = ( this.timer );
		data.alignment = ( this.alignment );
		data.damage = ( this.damage );
		data.dots = ( this.dots );

		//data.speed = JSON.stringify( this.speed );
		//data.exp = JSON.stringify( this.exp );

		if ( this.primary ) data.primary = this.primary.id;

		return data;

	}

	constructor( vars=null ){

		super(vars);
		//if ( vars ) Object.assign( this, vars );
		this._level = this._level || 0;
		this._title = this._title || 'waif';

		this._next = this._next || 100;

		this.speed = this._speed || 1;

		this._tohit = this._tohit || 2;
		this._defense = this._defense || 1;

		this.type = "player";

		/**
		 * @property {number} timer
		 */
		this.timer = this.timer || 0;

		this.damage = this.damage || new Range( 1, 2 );

		this.alignment = this.alignment || 'neutral';

		/**
		 * @property {Object[]} dots - timed/ongoing effects.
		 */
		this.dots = this.dots || [];

		/**
		 * @property {Item} primary - primary attack.
		 */
		this.primary = this.primary || null;

		this._name = this._name || 'wizrobe';

	}

	/**
	 * Set player's primary attack.
	 * @param {Item} s 
	 */
	setPrimary( s ) {

		if ( this.primary === s || !s.attack ) return;
		if ( this.primary !== null ) this.removePrimary();

		this.primary = s;
		if ( this.primary.attack.tohit ) this.tohit += this.primary.attack.tohit;

	}

	/**
	 * Clear player's primary attack.
	 */
	removePrimary() {

		let p = this.primary;
		this.primary = null;
		if ( p.attack.tohit ) this.tohit -= p.attack.tohit;

	}

	levelUp() {

		this._level++;

		if ( this._level % 2 === 1) this.tohit++;

		this.hp.max += 1;
		this.stamina.max += 1;

		this._exp.value -= this._next;
		this._next = this._next * ( 1 + EXP_RATE );

	}

}