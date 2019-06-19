const MAX_LEVEL = 100;
const EXP_RATIO = 0.5;

export default class Skill {

	get type() { return 'skill'; }

	get id() { return this._id; }
	set id(v) { this._id = v;}

	get name() { return this._name || this._id;}
	set name(v) { this._name = v;}

	get desc() { return this._desc; }
	set desc(v) { this._desc=v;}

	get value() { return this._level; }
	set value(v) { this._level = v; }
	valueOf() { return this._level; }

	get level() { return this._level; }
	set level(v) { this._level =v; }

	get exp() { return this._exp; }
	set exp(v) { this._exp=v;}

	/**
	 * @property {number} next - level up experience.
	 */
	get max() { return this._max; }
	set max(v) { this._max = v;}

	constructor( vars=null){

		if(vars) Object.assign( this, vars );

		this._max = this._max || 100;
		this._level = this._level || 0;
		this._exp = this._exp || 0;

	}

	levelUp() {

		if ( ++this._level > MAX_LEVEL ) this._level = MAX_LEVEL;

		this._exp = 0;
		this._max += this._max*EXP_RATIO;

	}

}