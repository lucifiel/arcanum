import Range from "../values/range";
import {ParseMods } from "../values/mod";
import { setModCounts } from "../items/base";
import { ParseDmg } from "./attack";
import Game from "../game";
import {mergeSafe} from 'objecty';

export const NO_ACT = 7;
export const NO_ATTACK = 1;
export const NO_DEFEND = 2;
export const NO_SPELLS = 4;

export default class Dot {

	toJSON(){

		if ( !this.id ) {
			console.warn('NO DOT ID: ' + this );
			return undefined;
		}

		return {

			id:this.id,
			kind:this.kind || undefined,
			name:this.name || undefined,
			dmg:this.damage || undefined,
			effect:this.effect||undefined,
			mod:this.mod||undefined,
			acc:this.acc||undefined,
			state:this.state||undefined,
			adj:this.adj||undefined,
			flags:this._flags!== 0 ? this._flags : undefined,
			duration:this.duration,
			source:this.source ? ( typeof this.source === 'string' ? this.source : this.source.id ) : undefined
		};

	}

	get id() { return this._id; }
	set id(v) {
		this._id =v;
	}

	get mod() { return this._mod; }
	set mod(v) { this._mod = v; }

	/**
	 * @property {string} verb - verb for dots that define state, e.g. sleeping.
	 */
	get adj() { return this._adj || this._name || this._id; }
	set adj(v) { this._adj = v; }

	get dmg(){return this.damage;}
	set dmg(v) { this.damage = v; }

	get damage() { return this._damage; }
	set damage(v) {
		this._damage = ParseDmg(v);
	}

	/**
	 * @property {string} flags
	 */
	get flags(){return this._flags;}
	set flags(v) {

		if ( typeof v === 'string') {
			this.setFlags( v.split(','));
		} else this._flags = v;

	}

	/**
	 * @property {boolean} perm - dot is permanent.
	 */
	get perm(){return this._perm;}
	set perm(v) { this._perm =v}

	valueOf(){ return ( this.perm || this.duration > 0 ) ? 1 : 0; }

	canCast() { return (this._flags & NO_SPELLS) === 0 }
	canAttack() { return (this._flags & NO_ATTACK) === 0 }
	canDefend() { return (this._flags & NO_DEFEND ) === 0 }

	constructor( vars, source, name ){

		Object.assign( this, vars );

		this.source = this.source || source || null;

		if ( !this.name ) this.name = name || ( source ? source.name : '' );

		if ( !this.id ) console.error('BAD DOT ID: ' + this.name );

		if ( !this.duration) this.duration = 10;

		/**
		 * @property {boolean} stack - ability of dot to stack.
		 */
		if ( this.mod ){

			this.mod = ParseMods( this.mod, this.id );

			setModCounts( this.mod, this );
		}
		if ( !this.flags ) this.flags = 0;

		/**
		 * @private {number} acc - integer accumulator
		 */
		this.acc = this.acc || 0;

	}

	applyTo( targ ) {

		targ.applyMods( this.mods, 1 );

	}

	/**
	 * Extend duration to the given number of seconds.
	 * @param {number} duration
	 */
	extend( duration ) {

		if ( duration === 0|| this.perm ) {

			this.perm = true;;
			this.duration = 0;

		} else if ( duration > this._duration ) {
			this._duration = duration;
		}
	}

	/*mergeDots(v) {

		let st = Game.getData(v);
		if ( st ) {

			let f = this.flags;
			mergeSafe( this, st );

			if ( f ) {
				this.flags = st.flags;
				this._flags |= f;
			}

		}

	}*/

	setFlags( list ) {

		let f = 0;

		for( let i = list.length-1; i >= 0; i-- ) {

			var v = list[i];
			if ( v === 'noact') f |= NO_ACT;
			else if ( v === 'noattack') f |= NO_ATTACK;
			else if ( v === 'nodefend' ) f |= NO_DEFEND;
			else if ( v === 'nocast') f |= NO_SPELLS;

		}

		this._flags = f;

	}

	revive(state) {

		if ( this.source && typeof this.source === 'string') this.source = state.getData( this.source );
		//if ( this.mod ) this.mod = ParseMods(this.mod, this.id);

	}

	/**
	 * Ticks dt and returns the amount the dot has actually ticked,
	 * (allowing for seconds-only updates.)
	 * @param {number} dt
	 * @returns {number} - amount of tick time to count.
	 */
	tick(dt) {

		this.acc += dt;
		if ( this.acc >= 1 ) {

			this.acc--;
			if ( !this.perm ) this.duration--;

			return 1;

		}

		return 0;

	}

}