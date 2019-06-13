export default class Upgrade {

	get id() {return this._id; }
	set id(v) { this._id = v;}

	get name() { return this._name; }
	set name(v) {
		this._name = v;
	}

	get desc() {
		return this._desc;
	}
	set desc(v){
		this._desc = v;
	}

	get requires() { return this._requires; }
	set requires(v){this._requires=v;}

	get locks(){ return this._locks; }
	set locks(v){
		this._locks=v;
	}

	constructor( vars=null ) {

		if (vars) Object.assign( this, vars );

	}

}