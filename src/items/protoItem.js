import GData from "./gdata";

/**
 * Generic prototype for a wearable item.
 */
export default class ProtoItem extends GData {

	toJSON() {

		let data = this.excludeJSON( ['kind'] );
		return data ? data : undefined;

	}

	get isProto() { return true; }

	get material() { return this._material; }
	set material(v) { this._material=v;}

	/**
	 * @property {} armor
	 */
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

		this.type = this.type || 'wearable';

		console.log('PROTO ITEM TYPE: ' + this.type );

		this.level = this.level || 1;
		this.kind = this.kind || 'equip';
		if ( this.attack ) {

			this.attack.damage = this.attack.damage || this.attack.dmg;

		}

	}

}