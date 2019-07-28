import Item from "./item";

export default class Wearable extends Item {

	toJSON() {

		let data = super.toJSON();

		data.kind = this.kind;
		data.slot = this.slot;
		if ( this._armor ) data.armor = this._armor;
		if ( this._attack ) data.attack = this._attack;
		if ( this.hands ) data.hands = this.hands;
		if ( this.level ) data.level = this.level;

		return data;

	}

	get armor(){ return this._armor; }
	set armor(v) { this._armor = v; }

	get attack() { return this._attack; }
	set attack(v) { this._attack = v; }

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
		if ( this.attack ) {

			this.attack.damage = this.attack.dmg;
			if ( !this.attack.tohit ) this.attack.tohit = 1;

		}

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