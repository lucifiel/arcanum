import Range from '../range';
import Base, {mergeClass} from '../items/base';
import {tryDamage} from '../composites/raid';
import ModStat from '../modStat';
import Dot from './dot';
import Attack from './attack';
import GameState from '../gameState';

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

	get attacks() { return this._attacks; }
	set attacks(v){

		for( let i = v.length-1; i>=0; i-- ) {
			v[i] = (v[i] instanceof Attack) ? v[i] : new Attack(v[i]);

		}

		this._attacks = v;
	}

	get attack() { return this._attack; }
	set attack(v) {
		this._attack = ( v instanceof Attack) ? v : new Attack(v);
	}

	get dots() { return this._dots; }
	set dots(v) {

		for( let i = v.length-1; i >= 0; i-- ) {
			v[i] = new Dot(v[i]);
		}
		this._dots =v;

	}

	get regen() { return this._regen; }
	set regen(v) { this._regen = ( v instanceof ModStat ) ? v : new ModStat(v); }

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
	 * Revive from data after Game state restored.
	 * @param {GameState} state
	 */
	revive( state ){

		for( let i = this.dots.length-1; i>=0; i--) this.dots[i].revive(state);

		if ( this.template ) {

			console.log('restoring from template');
			let it = state.getItem( this.template );
			if ( it ) this.mergeSafe( this, it );
			else console.warn('template not found: ' + this.template );

		}

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
					tryDamage( dot.damage, dot, dot.source );
				}

			}

		}

		if ( this.regen ) this.hp += this.regen*dt;

		if ( !this.alive ) return;

		this.timer -= dt;
		if ( this.timer <= 0 ) {

			this.timer += this.delay;
			return this.attacks || ( this.attack || this );

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