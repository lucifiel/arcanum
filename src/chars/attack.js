import Range from "../range";

export default class Attack {

	toJSON(){
	}

	set dmg(v) {
		this.damage = v;
	}

	get damage() {
	}
	set damage(v) {

		if ( v instanceof Range ) this._damage = v;
		else if ( !isNaN(v) ) this._damage = Number(v);
		else if ( typeof v === 'string' || typeof v === 'object') this._damage = new Range(v);

	}

	constructor( vars=null ){

		if ( vars ) Object.assign(this,vars);

	}

}