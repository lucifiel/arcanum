export default class Status {

	get id() { return this._id; }
	set id(v) { this._id =v;}

	get name() { return this._name; }
	set name(v) { this._name = v;}

	get value() { return this._value; }
	set value(v) { this._value=v;}

	constructor( vars){

		if ( vars ) Object.assign(this, vars);
	}

}