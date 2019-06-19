export default class Player {

	get level() { return this._level; }
	set level(v) { this._level=-v;}

	get title() { return this._title; }
	set title(v) { this._title =v;}

	constructor( vars=null ){

		if ( vars ) Object.assign( this, vars );

		this._level = this._level || 0;
		this._title = this._title || 'waif';

	}

}