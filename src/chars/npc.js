import Char from './char';
import Monster from '../items/monster';
import { cloneClass  } from 'objecty'
import Range from '../range';

/**
 * Class for specific Enemies/Minions in game.
 */
export default class Npc extends Char {

	get maxHp() { return this._maxHp; }
	set maxHp(v) {
		this._maxHp = v;
	}

	get hp() { return this._hp; }
	set hp(v) {

		if ( this._maxHp && v > this._maxHp ) v = this._maxHp;
		this._hp = v;

	}

	get damage() {
		return this._damage;
	}
	set damage(v) {

		if ( v && !(v instanceof Range) ) {
	
			if ( typeof v === 'string' || typeof v === 'object') this._damage = new Range( v );
			else {

				this._damage = Number( v );
			}
	
		} else this._damage = v;

	}

	constructor(vars) {

		super( vars instanceof Monster ? cloneClass(vars) : vars );

		if ( typeof this.hp === 'string' || typeof this.hp === 'object') this.hp = new Range(this.hp);
		if ( this.hp instanceof Range ) this.hp = this.hp.value;

		this._maxHp = this._maxHp || this._hp;

		if ( this.dmg && (this.damage===null||this.damage===undefined) ) this.damage = this.dmg;
		if ( this.damage ) console.log('dmg: ' + this.damage);

	}

	update(dt) {

		super.update(dt);
		
		if ( !this.alive ) return;

		this.timer -= dt;
		if ( this.timer <= 0 ) {

			this.timer += this.delay;
			return this.attack || this;

		}

	}

}