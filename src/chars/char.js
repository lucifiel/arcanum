import Range from '../range';
import {tryDamage} from './raid';
import { clone  } from 'objecty'

/**
 * @constant {number} DELAY_RATE - speed to attack delay conversion constant.
 */
export const DELAY_RATE = 3;
export function getDelay(s) {
	return DELAY_RATE*Math.exp(-s/4);
}

/**
 * Create new character from Monster data.
 * @param {Monster} data 
 */
export function fromMonster( data ) {

	let c = new Char( clone(data) );

	if ( c.dmg && !c.damage ) c.damage = c.dmg;
	if ( c.damage && !(c.damage instanceof Range) ) {

		if ( typeof c.damage === 'string' || typeof c.damage === 'object') c.damage = new Range( c.damage );
		else c.damage = Number( c.damage );

	}

	if ( typeof c.hp === 'string' || typeof c.hp === 'object') c.hp = new Range(c.hp);
	if ( c.hp instanceof Range ) c.hp = c.hp.value;

	return c;

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

	get name() { return this._name || this.id; }
	set name(v) { this._name = v; }

	/**
	 * @property {string|string[]} tag - tag to distinguish between
	 * item subtypes.
	 */
	get tags() { return this._tags;}
	set tags(v) {

		if ( typeof v === 'string') this._tags = v.split(',');
		else this._tags = v;

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

	}

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

		if ( this.alive===false) return;

		for( let i = this.dots.length-1; i >= 0; i-- ) {

			var dot = this.dots[i];
			let dotTime = dot.tick(dt);

			if ( dotTime ) {

				if ( dot.duration <= 0 ) {
					this.dots.splice( i, 1);
				}
				if ( dot.damage ) {
					tryDamage( dot.damage, dot );
					if ( !this.alive ) return;
				}
	
			}

		}

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

		/**
	 * 
	 * @param {string} tag 
	 */
	addTag( tag ) {
		if ( this._tags === null || this._tags === undefined) this._tags = [ tag ];
		else if ( !this._tags.includes(tag) ) this._tags.push(tag);
	}

	/**
	 * Test if item has every tag in list.
	 * @param {string[]} a - array of tags to test.
	 * @returns {boolean}
	 */
	hasTags( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return false;

		return true;

	}

	/**
	 * Test if tag has any tag in the list.
	 * @param {string[]} a - array of tags to test.
	 * @returns {boolean}
	 */
	anyTag( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return true;

		return false;

	}

	/**
	 * 
	 * @param {string} t - tag to test.
	 * @returns {boolean}
	 */
	hasTag( t ) { return this._tags && this._tags.includes(t); }

}