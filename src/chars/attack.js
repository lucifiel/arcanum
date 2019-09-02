import Range from "../range";

export default class Attack {

	toJSON(){

		return {
			dmg:this._damage,
			tohit:this.tohit||undefined,
			kind:this.kind,
			id:this.id,
			dot:this.dot
		};

	}

	set dmg(v) { this.damage = v; }

	get damage() { return this._damage; }
	set damage(v) {

		if ( v instanceof Range ) this._damage = v;
		else if ( !isNaN(v) ) this._damage = Number(v);
		else if ( typeof v === 'string' || typeof v === 'object') this._damage = new Range(v);

	}

	constructor( vars=null ){

		if ( vars ) Object.assign(this,vars);

		this.damage = this.damage || 0;
		this.tohit = this.tohit || 0;

	}

}