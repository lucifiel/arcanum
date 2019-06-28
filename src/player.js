import Stat from "./stat";
import Resource from "./items/resource";

/**
 * @constant {number} EXP_RATE
 */
const EXP_RATE = 0.05;

export default class Player {

	get name() { return this._name; }
	set name(v) { this._name = v;}

	get level() { return this._level; }
	set level(v) { this._level=-v;}

	get title() { return this._title; }
	set title(v) { this._title =v;}

	get exp(){ return this._exp; }
	set exp(v) {
		this._exp = v;
		if ( v >= this._next ) this.levelUp();
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

	get attack() { return this._attack; }
	set attack(v) { this._attack = v; }

	get speed() { return this._speed; }
	set speed(v) {
		this._speed = v;
		this._delay = 1/v;
	}

	get minDmg() { return this._minDmg; }
	set minDmg(v) { this._minDmg=v;}

	get maxDmg() { return this._maxDmg; }
	set maxDmg(v) { this._maxDmg=v;}

	/**
	 * @property {number} delay - time between attacks.
	 */
	get delay() { return this._delay; }

	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );

		this._level = this._level || 0;
		this._title = this._title || 'waif';

		this._exp = this._exp || 0;
		this._next = this._next || 100;

		this.speed = this._speed || 1;

		this._attack = this._attack || 2;
		this._defense = this._defense || 1;

		this._minDmg = this._minDmg || 1;
		this._maxDmg = this._maxDmg || 2;

		this._name = this._name || 'wizrobe';

	}

	levelUp() {

		this._level++;

		this._exp -= this._next;
		this._next = this._next * ( 1 + EXP_RATE );

	}

}