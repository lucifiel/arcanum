export default class Player {

	get name() { return this._name; }
	set name(v) { this._name = v;}

	get level() { return this._level; }
	set level(v) { this._level=-v;}

	get title() { return this._title; }
	set title(v) { this._title =v;}

	get hp() { return this._hp; }
	set hp(v) { this._hp = v;}

	get armor() { return this._armor; }
	set armor(v) { this._armor =v; }

	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );

		this._level = this._level || 0;
		this._title = this._title || 'waif';

		this._armor = this._armor || 0;
		this._hp = this._hp || 10;
		this._name = this._name || 'wizrobe';

	}

}