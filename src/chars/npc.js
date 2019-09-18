import Char from './char';
import Monster from '../items/monster';
import { cloneClass  } from 'objecty'
import Range from '../range';
import Stat from '../stat';

/**
 * @const {number} ALLY - team constant for allies.
 */
export const ALLY = 1;

/**
 * Class for specific Enemies/Minions in game.
 */
export default class Npc extends Char {

	toJSON() {

		let data = super.toJSON();
		data.id = this.id;
		data.template = this.template.id;
		data.cost = undefined;
		data.team = this.team||undefined;

		return data;

	}

	get maxHp() { return this._maxHp; }
	set maxHp(v) {
		this._maxHp = v instanceof Stat ? v : new Stat(v);
	}

	get hp() { return this._hp; }
	set hp(v) {

		if ( this._maxHp && v > this._maxHp ) this._hp = this._maxHp.value;
		else this._hp = v;

	}

	get damage() { return this._damage; }
	set damage(v) {

		if ( v && !(v instanceof Range) ) {

			if ( typeof v === 'string' || typeof v === 'object') this._damage = new Range( v );
			else {

				this._damage = Number( v );
			}

		} else this._damage = v;

	}

	/**
	 * @property {number} team - side in combat.
	 */
	get team() { return this._team; }
	set team(v) { this._team=v;}

	/**
	 * @property {boolean} active - whether minion is active in combat.
	 */
	get active() { return this._active; }
	set active(v) { this._active = v; }

	constructor(vars) {

		super( vars instanceof Monster ? cloneClass(vars) : vars );

		this.dodge = this.dodge || 0;

		this.active = this.active === undefined || this.active === null ? false : this.active;

		if ( typeof this.hp === 'string' || typeof this.hp === 'object') this.hp = new Range(this.hp);
		if ( this.hp instanceof Range ) this.hp = this.hp.value;

		this.tohit = this.tohit || 0;
		this.maxHp = this._maxHp || this._hp;

		if ( this.dmg && (this.damage===null||this.damage===undefined) ) this.damage = this.dmg;

	}

	rest(dt) {
		this.hp += 0.01*this.maxHp.value*dt;
	}

	/**
	 * @returns {number} the damage from a single attack by npc.
	 */
	getDamage() {
		return this.attack ? this.attack.getDamage() : (
			(typeof this._damage === 'number') ? this._damage : this._damage.value
		);
	}

	/*update(dt) {

		super.update(dt);

		if ( !this.alive ) return;

		this.timer -= dt;
		if ( this.timer <= 0 ) {

			this.timer += this.delay;
			return this.attacks || this.attack || this;

		}

	}*/

}