import Base, {mergeClass} from '../items/base';
import Range from "../range";
import Attack from './attack';

import {mergeSafe} from "objecty";


export default class Wearable {

	toJSON() {

		let data = this.excludeJSON( ['material', 'kind'] ) || {};

		data.id = this.id;
		data.template = this.template.id;
		data.name = this.name;

		data.enchants = this.enchants || undefined;

		if ( this.material ) {
			if ( !data ) data = {};
			data.material = this.material.id;
		}

		return data ? data : undefined;

	}

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

	get tohit() { return this._attack ? this._attack.tohit : this._tohit; }
	set tohit(v) {
		if ( this._attack ) this._attack.tohit = v;
		else this._tohit = v;
	}

	get attack() { return this._attack; }
	set attack(v) {

		if ( v ) {

			this._attack = v instanceof Attack ? v : new Attack(v);

		} else this._attack = null;

	}

	/**
	 * @property {string} kind - subtype of wearable.
	 */
	get kind() { return this._kind; }
	set kind(v) { this._kind = v; }

	constructor(vars=null){

		if( vars ) Object.assign( this, vars);

		//console.log('this.attack: ' + this.attack );
		this.type = 'wearable';
	}

	maxed() { return false; }

	revive( state ) {

		if ( typeof this.material === 'string') this.material = state.getMaterial( this.material );

		if ( typeof this.template === 'string' ) this.template = state.getItem( this.template );
		if ( this.template ) {

			if ( this.armor === null || this.armor === undefined ) this.armor = this.template.armor;
			if ( this.tohit === null || this.tohit === undefined ) this.tohit = this.template.tohit;

			if ( this.attack === null || this.attack === undefined ) this.attack = this.template.attack;

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
		if ( this.kind === 'weapon' ) player.weapon = this;

	}

	unequip( player ) {

		if ( this.armor ) player.defense -= this.armor;
		if ( player.weapon == this ) player.weapon = null;

	}

}


mergeClass( Wearable, Base );