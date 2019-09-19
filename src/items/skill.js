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

	get exp() { return super.exp; }
	set exp(v) {
		if ( this.maxed() ) return;
		super.exp = v;
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

		/** @compatibility */
		let len = (vars.template.lenghth || 50)*Math.pow( (1+EXP_RATIO), this.value );
		if ( this.length > len ) {
			this.length = len;
		}


		this.buy = this.buy || { "sp":1 };

		if ( !this.value) this.value = 0;
		this.rate = this.rate || new Stat(0.5);
		this.max = this.max || new Stat(5);

	}

	update( dt) {
		this.exp += dt*this._rate;
	}

	complete() {

		console.log('complete: ' + this.id );
		super.complete();
		if ( this._value > Math.floor(this._max) ) this._value = Math.floor(this._max);
		this._length += this._length*EXP_RATIO;
		this.dirty = true;

	}

}