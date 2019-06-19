export default class Spellbook {

	get spells() { return this._spells; }
	set spells(v) { this._spells =v;}

	constructor(vars=null) {

		if(vars) Object.assign(this, vars);

		this._spells = {};

	}

}