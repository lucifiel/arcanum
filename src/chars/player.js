import Stat from "../stat";
import Resource from "../items/resource";
import Range from '../range';
import GData from "../items/gdata";
import Game from '../game';
import { tryDamage } from '../composites/combat';

import Char, { getDelay } from './char';
import Events, { LEVEL_UP } from "../events";

/**
 * @constant {number} EXP_RATE
 */
const EXP_RATE = 0.125;

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

	get className() { return this._className; }
	set className(v) { this._className = v; }

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

	get alive() {return this._hp.value > 0; }

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

		this.delay = getDelay( this._speed.value );

	}

	get mount() { return this._mount; }
	set mount(v) {
		this._mount = v;
	}

	/**
	 * NOTE: Elements that are themselves Items are not encoded,
	 * since they are encoded in the Item array.
	 */
	toJSON() {

		let data = {};

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
		data.className = this.className;

		if ( this.primary ) data.primary = this.primary.id;
		if ( this.weapon ) data.weapon = this.weapon.id;

		return data;

	}

	constructor( vars=null ){

		super(vars);

		this.id = this.type = "player";

		//if ( vars ) Object.assign( this, vars );
		this._level = this._level || 0;
		this._title = this._title || 'waif';

		this._next = this._next || 50;

		this.speed = this._speed || 1;

		this._tohit = this._tohit || 1;
		this._defense = this._defense || 0;

		this._resists = this._resists || {};
		for( let p in this._resists ) {
			this._resists[p] = new Stat( this._resists[p]);
		}

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

		this.bonuses = this.bonuses || {
		}

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
	 * Perform update effects.
	 * @param {number} dt - elapsed time.
	 */
	update( dt ) {

		let updates = this.dots;
		let dot;

		for( let i = updates.length-1; i >= 0; i-- ) {

			dot = updates[i];
			if ( !dot.tick(dt) ) continue;

			// ignore any remainder beyond 0.
			if ( dot.effect ) Game.applyEffect( dot.effect );
			if ( dot.damage ) tryDamage( this, dot, dot.source );

			if ( dot.duration <= dt ) {

				updates.splice( i, 1 );
				if ( dot.mod ) Game.addMod( dot.mod, -1 );

			} else dot.duration -= dt;


		}
		if ( this.regen ) this.hp += this.regen*dt;

	}

	/**
	 *
	 * @param {Dot} dot - dot to add.
	 */
	addDot( dot ) {

		let id = dot.id;

		let cur = id ? this.dots.find( d=>d.id===id) : undefined;
		if ( cur !== undefined ) {
			cur.duration = dot.duration;
		}
		else {

			this.dots.push( dot );
			if ( dot.mod ) Game.addMod( dot.mod, 1 );

		}

	}

	/* getResist( kind ) {
		return this._resists[kind].value / 100;
	}*/

	removeResist( kind, amt ) {
		if ( this._resists[kind] ) this._resists[kind].base -= amt;
	}

	addResist( kind, amt ) {

		if ( !this._resists[kind] ) this._resists[kind] = new Stat( amt );
		else this._resists[kind].base += amt;

	}

	/**
	 * Set primary spell attack.
	 * @param {GData} s
	 */
	setPrimary( s ) {

		if ( this.primary === s || ( s && !s.attack )) return;
		if ( this.primary !== null ) this.removePrimary();

		this.primary = s;

	}

	revive( state ) {

		super.revive(state);

		if ( this.weapon && (typeof this.weapon === 'string') ) this.weapon = state.equip.find( this.weapon );
		this.primary = this.primary && typeof this.primary === 'string' ? state.getData( this.primary ) : this.primary;

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

		this.dirty = true;
		if ( this._level % 3 === 0 ) this.sp.value++;

		this.tohit++;
		this.hp.max += 2;
		this.stamina.max += 1;

		this._exp.value -= this._next;
		this._next = Math.floor( this._next * ( 1 + EXP_RATE ) );

		Events.dispatch( LEVEL_UP, this );

	}

}