import Base, {mergeClass} from '../items/base';
import Range from "../range";
import Attack from './attack';

import {mergeSafe,assign} from "objecty";
import Mod from '../mod';


export default class Wearable {

	get value() { return 1;}
	set value(v) {}

	toJSON() {

		let data = this.excludeJSON( ['material', 'kind'] ) || {};

		data.id = this.id;

		if ( !this.template ) console.warn('err: missing template: ' + this.id );
		else data.template = this.template.id;

		data.name = this.name;
		data.attack = this.attack || undefined;

		data.enchants = this.enchants || undefined;
		if ( this.mod ) data.mod = this.mod;

		if ( this.material ) {
			if ( !data ) data = {};
			data.material = this.material.id;
		}

		return data ? data : undefined;

	}

	get instance() { return true; }
	get equippable() { return true; }

	/**
	 * @property {string} protoId - id of item template used to instance this item.
	 */
	get protoId() { return this.template?  this.template.id : this._id; }

	/**
	 * @property {number} enchants - total level of all enchantments applied.
	 */
	get enchants() { return this._enchants || 0; }
	set enchants(v) { this._enchants = v; }

	get material() { return this._material; }
	set material(v) { this._material=v;}

	/**
	 * @property {} armor
	 */
	get armor(){ return this._armor; }
	set armor(v) { this._armor = v; }

	get attack() { return this._attack; }
	set attack(v) {

		if ( v ) {

			this._attack = v instanceof Attack ? v : new Attack(v);

			console.log(this.id + ' attack: ' + this._attack );

		} else this._attack = null;

	}

	/**
	 * @property {string} kind - subtype of wearable.
	 */
	get kind() { return this._kind; }
	set kind(v) { this._kind = v; }

	/*get mod() { return this._mod; }
	set mod(v) {
		this._mod = this.convertMods(v);
	}*/

	constructor(vars=null){

		if( vars ) assign( this, vars);

		//console.log('this.attack: ' + this.attack );
		this.type = this.type || 'wearable';
	}

	maxed() { return false; }

	revive( state ) {

		if ( typeof this.material === 'string') this.material = state.getMaterial( this.material );

		if ( typeof this.template === 'string' ) this.template = state.getData( this.template );
		if ( this.template ) {

			if ( this.armor === null || this.armor === undefined ) this.armor = this.template.armor;
			if ( this.tohit === null || this.tohit === undefined ) this.tohit = this.template.tohit;

			if ( this.attack === null || this.attack === undefined ) this.attack = this.template.attack;

			this.type = this.template.type || this.type;

			mergeSafe( this, this.template );

		} else console.log('wearable template not found: ' + this.template );

	}

	applyMaterial( mat ) {

		if (!mat) return;

		this.material = mat;
		if ( this.armor !== null && this.armor !== undefined ) this.applyBonus( this, 'armor', mat.bonus );

		if ( this.attack ) {

			if ( this.attack.damage !== null && this.attack.damage !== undefined ) {
				this.applyBonus( this.attack, 'damage', mat.bonus );
			}
			if ( mat.tohit ) this.applyBonus( this.attack, 'tohit', mat.tohit );

		} else {

		}

	}

	/**
	 * Bonus applied by material.
	 * @param {*} obj
	 * @param {*} prop
	 * @param {*} amt
	 */
	applyBonus( obj, prop, amt ) {

		if ( typeof obj[prop] === 'number') obj[prop] += amt;
		else if ( obj[prop] instanceof Range ) obj[prop].add( amt );

	}

	equip( player ) {

		if ( this.armor ) player.defense += this.armor;
		if ( this.type === 'weapon' ) player.weapon = this;

	}

	unequip( player ) {

		if ( this.armor ) player.defense -= this.armor;
		if ( player.weapon == this ) player.weapon = null;

	}

	convertMods(v) {

		let t = typeof v;
		if ( v instanceof Mod ) {
			console.log('ALREADY MOD: ' + v );
			return v;
		}

		console.log('CONVERTING MOD: ' + this.id );
		if ( t === 'object') {

			if ( v.id ) {
				console.log('creating mod: ' );
				for( let p in v ) console.log( p + ' -> ' + v[p]);
				return new Mod( v );
			} else {

				for( let p in v ) {
					v[p] = this.convertMods( v[p] );
				}

			}

		} else if ( t === 'string' || t==='number') return new Mod(v, this.id);

		return v;

	}

}


mergeClass( Wearable, Base );