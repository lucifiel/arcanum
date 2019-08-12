import Range from '../range';
import Base, {mergeClass} from '../items/base';
import {tryDamage} from './raid';
import { cloneClass  } from 'objecty'
import Stat from '../stat';

/**
 * @constant {number} DELAY_RATE - speed to attack delay conversion constant.
 */
export const DELAY_RATE = 3;
export function getDelay(s) {
	return DELAY_RATE*Math.exp(-s/4);
}

export default class Char {

	toJSON(){

		let data = {}

		for( let k in this ) {

			if ( k[0] === '_' ) continue;
			data[k] = this[k];

		}

		return data;

	}

	get statuses() { return this._statuses; }
	set statuses(v) { this._statuses = v; }

	get defense() { return this._defense; }
	set defense(v) { this._defense =v; }

	get tohit() { return this._tohit; }
	set tohit(v) { this._tohit = v; }

	get statuses() { return this._statuses; }
	set statuses(v) { this._statuses = v; }

	get resists() { return this._resists };
	set resists(v) { this._resists = v; }

	get speed() { return this._speed; }
	set speed(v) {
		this._speed = v;
		this.delay = getDelay(v);
	}

	get attack() { return this._attack; }
	set attack(v) {

		v.damage = v.damage || v.dmg;
		if ( v.damage ) {
			if (typeof v.damage === 'string' ) v.damage = new Range(v.damage);
			else if ( isNaN(v.damage)) v.damage = new Range( v.damage);
		}
		this._attack = v;

	}

	get regen() { return this._regen; }
	set regen(v) { this._regen = ( v instanceof Stat ) ? v : new Stat(v); }

	get alive() { return this.hp > 0; }
	set alive(v) { if ( !v ) this.hp = 0;}

	constructor( vars ){

		if ( vars ) Object.assign( this, vars );

		this.statuses = this.statuses || {};
		this.immunities = this.immunities || {};
		this._resists = this._resists || {};

		//console.log( this.id + ' damage: ' + this.damage );
		//console.log( this.id + ' tohit: ' + this.tohit );

		/**
		 * @property {Object[]} dots - timed/ongoing effects.
		*/
		this.dots = this.dots || [];

		/**
		 * @property {number} timer
		 */
		this.timer = this.timer || this.delay;

	}

	/**
	 * Monster no longer being used as a prototype, but as active combatant.
	 */
	setActive() {

		if ( this.hp instanceof Range ) this.hp = this.hp.value;
		this.alive = true;

	}

	/**
	 * Base item of dot.
	 * @param {Dot} it 
	 */
	addDot( it ) {

		let id = it.id;

		let cur = id ? this.dots.find( d=>d.id===id) : undefined;
		if ( cur !== undefined ) cur.duration = it.duration;
		else {
			this.dots.push( new Dot(it) );
		}

	}

	update(dt) {

		for( let i = this.dots.length-1; i >= 0; i-- ) {

			var dot = this.dots[i];
			let dotTime = dot.tick(dt);

			if ( dotTime ) {

				if ( dot.duration <= 0 ) {
					this.dots.splice( i, 1);
				}
				if ( dot.damage ) {
					tryDamage( dot.damage, dot );
				}
	
			}

		}

		if ( this.regen ) this.hp += this.regen*dt;

		if ( !this.alive ) return;

		this.timer -= dt;
		if ( this.timer <= 0 ) {

			this.timer += this.delay;
			return this.attack ? this.attack : this;

		}

	}

	hasStatus(stat) { return this.statuses[stat] > 0; }
	isImmune(kind) { return this.immunities[kind] > 0; }

	/**
	 * Roll a resistance check against the given damage type.
	 * @param {string} kind - kind of damage.
	 */
	tryResist(kind) {

		return ( this.resists && this.resists[kind] ) ? 100*Math.random() < this.resists[kind] : false;

	}

	
	removeResist( kind, amt ) {
		if ( this._resists[kind] ) this._resists[kind] -= amt;
	}

	addResist( kind, amt ) {

		if ( !this._resists[kind] ) this._resists[kind] = amt;
		else this._resists[kind].base += amt;

	}

	addStatus(stat) {
		this.statuses[stat] = this.statuses[stat] ? this.statuses[stat] + 1 : 1;
	}

	removeStatus(stat) {
		this.statuses[stat] = this.statuses[stat] ? this.statuses[stat] - 1 : 0;
	}

	/**
	 * 
	 * @param {string} kind 
	 */
	addImmune(kind){
		this.immunities[kind] = this.immunities[kind] ? this.immunities[kind] + 1 : 1;
	}

	/**
	 * 
	 * @param {string} kind 
	 */
	removeImmune(kind) {
		this.immunities[kind] = this.immunities[kind] ? this.immunities[kind] - 1 : 0;
	}

}

mergeClass( Char, Base );