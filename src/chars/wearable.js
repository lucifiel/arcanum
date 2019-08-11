import Item from "../items/item";
import Range from "../range";
import {mergeSafe} from "objecty";

export default class Wearable extends Item {

	toJSON() {

		let data = this.subJSON( ['material'] );

		data.id = this.id;
		data.template = this.template.id;
		if ( this.material ) {
			if ( !data ) data = {};
			data.material = this.material.id;
		}

		return data ? data : undefined;

	}

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

			let dmg = v.damage = v.damage || v.dmg;
			if ( dmg && !(dmg instanceof Range)) {

				v.damage = new Range(dmg)

			}
			v.tohit = v.tohit || 0;

		}

		this._attack = v;		

	}

	/**
	 * @property {string} kind - subtype of wearable.
	 */
	get kind() { return this._kind; }
	set kind(v) { this._kind = v; }

	constructor(vars=null){

		super(vars);
		this.type = 'wearable';

		this.level = this.level || 1;
		this.kind = this.kind || 'equip';

	}

	revive( state ) {

		if ( typeof this.material === 'string') this.material = state.getMaterial( this.material );

		if ( typeof this.template === 'string' ) this.template = state.getItem( this.template );
		if ( this.template ) mergeSafe( this, this.template );
		else console.log('wearable template not found: ' + this.template );

	}

	applyMaterial( mat ) {

		if (!mat) return;

		this.material = mat;
		if ( this.armor !== null && this.armor !== undefined ) this.applyBonus( this, 'armor', mat.bonus );

		if ( this.attack ) {

			if ( this.attack.damage !== null && this.attack.damage !== undefined ) this.applyBonus( this.attack, 'damage', mat.bonus );

		}

	}

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