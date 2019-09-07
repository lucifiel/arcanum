import Action from './action';
import Stat from '../stat';

const EXP_RATIO = 0.35;

export default class Skill extends Action {

	toJSON(){

		let data = super.toJSON();

		// for skills, level is always equal to value.
		data.level = undefined;

		return data;

	}

	/**
	 * @deprecated - deprecation intended.
	 */
	get level() { return this.value; }
	set level(v) { this.value = v; }

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

		this.value = this._value || 0;
		this.rate = this.rate || new Stat(0.5);
		this.max = this.max || new Stat(5);

	}

	update( dt) {
		this.progress += dt*this._rate;
	}

	complete() {

		console.log('complete: ' + this.id );
		super.complete();
		if ( this._value > Math.floor(this._max) ) this._value = Math.floor(this._max);
		this._length += this._length*EXP_RATIO;
		this.dirty = true;

	}

}