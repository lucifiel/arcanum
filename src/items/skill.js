import Action from './action';
import Stat from '../stat';

const EXP_RATIO = 0.4;

export default class Skill extends Action {

	toJSON(){
	
		let data = super.toJSON();
		return data;

	}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null){

		super(vars);

		this.type = 'skill';
		this.length = this.length || 50;
		this.exp = this.exp || 0;

		this._value = this._value || 0;
		this.rate = this.rate || 1;
		this.max = this.max || 5;

	}

	update( dt) {
		this.progress += dt*this._rate;
	}

	complete() {

		if ( this._value > Math.floor(this._max) ) this._value = Math.floor(this._max);
		this._length += this._length*EXP_RATIO;

	}

}