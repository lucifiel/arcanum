import Item from './item';

const EXP_RATIO = 0.5;

export default class Skill extends Item {

	/**
	 * @property {number} level
	 */
	get level() { return this._value; }
	set level(v) { this._value =v; }

	/**
	 * @property {number} exp
	 */
	get progress() { return this._exp; }
	set progress(v) { this._exp=v;}

	/**
	 * @property {number} rate
	 */
	get rate() { return this._rate; }
	set rate(v) { this._rate = v;}

	/**
	 * @property {number} max - level up experience.
	 */
	get length() { return this._length; }
	set length(v) { this._length = v;}

	get max() { return this._max; }
	set max(v) { this._max = v; }

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null){

		super(vars);

		this.type = 'skill';
		this._length = this._length || 100;
		this._value = this._value || 0;
		this._exp = this._exp || 0;
		this._rate = this._rate || 2;
		this._max = this._max || 10;

	}

	update( dt) {

		this._exp += dt*this._rate;
		if ( this._exp >= this._length ) this.complete();

	}

	percent() { return 100*(this._exp / this._length ); }

	complete() {

		if ( ++this._value > Math.floor(this._max) ) this._value = Math.floor(this._max);

		this._exp -= this._length;
		this._length += this._length*EXP_RATIO;
		this._rate += 0.1;

	}

}