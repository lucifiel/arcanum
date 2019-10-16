/**
 * Character stub for Hall of Wizards.
 */
export default class CharInfo {

	toJSON(){

		return {
			name:this.name,
			level:this.level,
			title:this.title||undefined,
			gender:this.gender||undefined,
			school:this.school||undefined
		}

	}

	get name() { return this._name; }
	set name(v) { this._name =v;}

	get level(){return this._level;}
	set level(v) {this._level=v;}

	get title(){return this._title;}
	set title(v){ this._title =v;}

	get gender(){return this._gender;}
	set gender(v){ this._gender =v;}

	get school() { return this._school; }
	set school(v) { this._school = v; }

	constructor( vars=null ){

		if ( vars ) Object.assign( this,vars );

		if ( !this.name ) this.name = 'wizrobe';
		if ( !this.level ) this.level = 0;

	}

}