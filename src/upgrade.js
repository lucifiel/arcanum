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

	get require() { return this._require; }
	set require(v){this._require=v;}

	get locked() { return this._locked;}
	set locked(v) { this._locked = v; }

	get locks(){ return this._locks; }
	set locks(v){
		this._locks=v;
	}

	constructor( vars=null ) {

		if (vars) Object.assign( this, vars );
		
		if ( !this._require && !this._locked ) this._locked = false;
		else this._locked = true;

	}

}