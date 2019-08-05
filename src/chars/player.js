import Stat from "../stat";
import Resource from "../items/resource";
import Range from '../range';
import Item from "../items/item";
import Char from './char';

/**
 * @constant {number} EXP_RATE
 */
const EXP_RATE = 0.125;

/**
 * @constant {number} DELAY_RATE - speed to attack delay conversion constant.
 */
export const DELAY_RATE = 3;
export function getDelay(s) {
	return DELAY_RATE*Math.exp(-s/4);
}

export default class Player extends Char {

	get level() { return this._level; }
	set level(v) { this._level=v;}

	get title() { return this._title; }
	set title(v) { this._title =v;}

	get exp(){ return this._exp; }
	set exp(v) {

		if ( this._exp === undefined ) this._exp = v;
		else {

			this._exp.value = v;
			while ( this._next > 0 && this._exp.value >= this._next ) this.levelUp();

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

	/**
	 * @property {Wearable} weapon - primary weapon.
	 */
	get weapon() { return this._weapon; }
	set weapon(v) {
		this._weapon = v;
		if ( !v ) this._weapon = this.baseAttack;
	}

	/**
	 * @property {Resource} speed
	 * speed normalized to an average of level=speed.
	 */
	get speed() { return this._speed; }
	set speed(v) {

		if ( this._speed ) this._speed.value = Number(v);
		else if ( v instanceof Resource ) this._speed = v;
		else this._speed = new Resource( {value:v} );

		this._delay = getDelay( this._speed.value );

	}

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

		data.statuses = this.statuses;

		//data.speed = JSON.stringify( this.speed );
		//data.exp = JSON.stringify( this.exp );

		if ( this.primary ) data.primary = this.primary.id;
		if ( this.weapon ) data.weapon = this.weapon.id;

		return data;

	}

	constructor( vars=null ){

		super(vars);

		//if ( vars ) Object.assign( this, vars );
		this._level = this._level || 0;
		this._title = this._title || 'waif';

		this._next = this._next || 50;

		this.speed = this._speed || 1;

		this._tohit = this._tohit || 1;
		this._defense = this._defense || 1;

		this.type = "player";

		this._statuses = this._statuses || {
			fly:0,
			sleep:0,
			swim:0,
			immortal:0,
			paralyzed:0,
			stoned:0,
			confused:0
		};

		this.immunities = this.immunities || {
			fire:0,
			water:0,
			air:0,
			earth:0,
			light:0,
			shadow:0,
			arcane:0,
			physical:0,
			natural:0,
			poison:0,
			disease:0
		}
		/**
		 * @property {number} timer
		 */
		this.timer = this.timer || 0;

		this.baseAttack = this.baseAttack || {

			id:'baseAttack',
			name:'fists',
			attack:{
				tohit:1,
				kind:'blunt',
				damage:new Range(0,1)
			}

		};

		this.damage = this.damage || 1;

		this.alignment = this.alignment || 'neutral';

		/**
		 * @property {Item} primary - primary attack.
		 */
		this.primary = this.primary || null;
		this.weapon = this.weapon || this.baseAttack;

		this._name = this._name || 'wizrobe';

	}

	/**
	 * Set primary spell attack.
	 * @param {Item} s 
	 */
	setPrimary( s ) {

		if ( this.primary === s || !s.attack ) return;
		if ( this.primary !== null ) this.removePrimary();

		this.primary = s;

	}

	revive( state ) {

		if ( this.weapon && (typeof this.weapon === 'string') ) this.weapon = state.equip.find( this.weapon );
		this.primary = this.primary && typeof this.primary === 'string' ? state.getItem( this.primary ) : this.primary;

	}

	/**
	 * Clear primary spell attack.
	 */
	removePrimary() {

		//let p = this.primary;
		this.primary = null;

	}

	levelUp() {

		this._level++;

		if ( this._level % 2 === 1) this.tohit++;

		this.hp.max += 1;
		this.stamina.max += 1;

		this._exp.value -= this._next;
		this._next = Math.floor( this._next * ( 1 + EXP_RATE ) );

	}

}