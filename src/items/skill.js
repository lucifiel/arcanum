import Action from './action';

const EXP_RATIO = 0.35;

export default class Skill extends Action {

	toJSON(){

		let data = super.toJSON();
		return data;

	}

	get level() { return this._value; }
	set level(v) { this._value = v; }

	/**
	 *
	 * @param {?Object} [vars=null]
	 */
	constructor( vars=null){

		super(vars);

		this.type = 'skill';
		this.length = this.length || 50;
		this.exp = this.exp || 0;

		this.buy = this.buy || { "sp":1 };

		this._value = this._value || 0;
		this.rate = this.rate || 0.5;
		this.max = this.max || 5;

	}

	update( dt) {
		this.progress += dt*this._rate;
	}

	complete() {

		super.complete();
		if ( this._value > Math.floor(this._max) ) this._value = Math.floor(this._max);
		this._length += this._length*EXP_RATIO;
		this.dirty = true;

	}

}