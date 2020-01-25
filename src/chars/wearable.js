import { setModCounts} from '../items/base';
import Attack from './attack';

import {mergeSafe} from "objecty";
import Mod from '../values/mod';
import { ParseMods } from 'modules/parsing';
import { assign, assignRecursive } from 'objecty';
import Item from '../items/item';
import { WEARABLE, ARMOR, TYP_RANGE, TYP_STAT } from '../values/consts';
import Stat from '../values/stat';


export default class Wearable extends Item {

	toJSON() {

		let data = super.toJSON();

		if ( !this.save ) data.material = data.kind = undefined;
		data.id = this.id;

		if ( !this.template ) {

			//console.warn('MISSING TEMPLATE: ' + this.id );
			data.type = this.type;

		} else if ( typeof this.template === 'string' ) {

			data.template = this.template;

		} else data.template = this.template.id;

		data.name = this._name;
		data.attack = this.attack || undefined;

		if ( this.mod ) data.mod = this.mod;

		if ( this.material ) {
			if ( !data ) data = {};
			data.material = this.material.id;
		}

		return data ? data : undefined;

	}

	get damage() {
		return this._attack ? this._attack.damage : undefined;
	}

	get equippable() { return true; }

	/**
	 * @property {number} enchantTot - total level of all enchantments applied.
	 */
	get enchantTot(){return this._enchantTot}
	set enchantTot(v){
		this._enchantTot=v;
	}

	get material() { return this._material; }
	set material(v) { this._material=v;}

	/**
	 * @property {Stat} armor
	 */
	get armor(){ return this._armor; }
	set armor(v) {

		if ( this._armor ) {
			// NOTE: assign() copies _armor directly, so setter is never called. @todo fix this.
			if ( typeof this._armor === 'number') this._armor = new Stat(this._armor);
			this._armor.base = v;
		} else {
			this._armor = new Stat(v);
		}

	}

	get attack() { return this._attack; }
	set attack(v) {

		if ( v ) {
			this._attack = new Attack(v);
		} else {
			this._attack = null;
		}

	}

	/**
	 * @todo not implemented.
	 * @property {boolean} worn
	 */
	get worn(){ return this._worn; }
	set worn(v) { this._worn = v;}

	/**
	 * @property {string} slot
	 */
	get slot(){return this._slot; }
	set slot(v){this._slot=v;}

	/**
	 * @property {string} kind - subtype of wearable.
	 */
	get kind() { return this._kind; }
	set kind(v) { this._kind = v; }

	constructor(vars=null){

		super();

		this.stack = false;
		this.consume = false;

		if ( vars ) assign( this, vars, ['constructor']);

		this.value = this.val = 1;

		if ( !this.type ) { this.type = WEARABLE; }

		if ( this._attack && !this._attack.name ) this._attack.name = this.name;

	}

	maxed() { return false; }

	/**
	 * @note super.revive() cannot be called here because the revive is too complex.
	 * @param {GameState} gs
	 */
	revive( gs ) {

		if ( typeof this.material === 'string') this.material = gs.getMaterial( this.material );

		if ( typeof this.recipe === 'string' ) this.template = gs.getData(this.recipe );
		else if ( typeof this.template === 'string' ) this.template = gs.getData( this.template );

		if ( this.template ) {

			if ( this.armor === null || this.armor === undefined ) this.armor = this.template.armor;
			// bonus applied for using item; not linked to attack.
			if ( this.tohit === null || this.tohit === undefined ) this.tohit = this.template.tohit || 0;

			if ( this.attack === null || this.attack === undefined ) this.attack = this.template.attack;

			this.type = this.template.type || this.type;

			mergeSafe( this, this.template );

		} else console.log('bad template: ' + this.template );

		if ( !this.level || (this.template && this.level <= this.template.level)) {

			if ( this.template && this.template.level ) this.level = this.template.level.valueOf() || 1;
			else this.level = 1;

			if ( this.material && this.material.level ) {
				this.level += this.material.level.valueOf() || 0;
			}

		}

		if ( this.mod ) this.mod = ParseMods( this.mod, this.id, this );

		/*console.log('WEARABLE LEVEL: ' + this.level + ' MAT: '+ (this.material ? this.material.level : 0 )
		 + ' base: ' + (this.template ? this.template.level : 0 ) );*/
	}

	applyMaterial( mat ) {

		if (!mat) return;

		this.material = mat;

		this.level +=  this.material.level || 0;

		if ( this.armor !== null && this.armor !== undefined ) {
			this.applyBonus( this, ARMOR, mat.bonus );
		}

		if ( this.attack ) {

			console.log('APPLY MAT: ' + (mat.id) );

			if ( this.attack.damage !== null && this.attack.damage !== undefined ) {
				this.applyBonus( this.attack, 'damage', mat.bonus );
			}
			if ( mat.tohit ) {
				//console.log('apply mat to: ' + this.id );
				this.applyBonus( this.attack, 'tohit', mat.tohit );
			}

		} else {

		}

	}

	/**
	 * Bonus applied by material.
	 * @param {Object} obj - object being modified.
	 * @param {string} prop
	 * @param {number|Mod} amt
	 */
	applyBonus( obj, prop, amt=0 ) {

		let cur = obj[prop];
		if ( cur === null || cur === undefined ) {
			obj[prop] = amt;
		}
		else if ( typeof cur === 'number') {
			 obj[prop] = cur + amt;
		}
		else if ( cur.type === TYP_RANGE || cur.type === TYP_STAT ) {
			cur.add( amt );
		}

	}

	/**
	 *
	 * @param {Game} g
	 */
	equip( g ) {

		let p = g.state.player;

		if ( this.armor ) p.defense.add( this.armor );
		if ( this.type === 'weapon' ) p.weapon = this;

		if ( this.mod ) {
			setModCounts( this.mod, 1);
			g.applyMods( this.mod );
		}
	}

	/**
	 *
	 * @param {Game} g
	 */
	unequip( g ) {

		let p = g.state.player;

		if ( this.armor ) p.defense.add( -this.armor );
		if ( p.weapon === this ) p.weapon = null;

		if ( this.mod ) {

			setModCounts( this.mod, 0);
			g.applyMods( this.mod );

		}

	}

	convertMods(v) {

		let t = typeof v;
		if ( v instanceof Mod ) return v;

		if ( t === 'object') {

			if ( v.id ) {
				//console.log('new mod: ' +this.id);
				//for( let p in v ) console.log( p + ' -> ' + v[p]);
				return new Mod( v, v.id, this );
			} else {

				for( let p in v ) {
					v[p] = this.convertMods( v[p] );
				}

			}

		} else if ( t === 'string' || t==='number') return new Mod(v, this.id, this );

		return v;

	}

}