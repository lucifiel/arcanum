import Item from './item';

const MAX_LEVEL = 100;
const EXP_RATIO = 0.5;

export default class Skill extends Item {

	get type(){return 'skill';}

	/**
	 * @property {number} level
	 */
	get level() { return this._value; }
	set level(v) { this._value =v; }

	/**
	 * @property {number} exp
	 */
	get exp() { return this._exp; }
	set exp(v) { this._exp=v;}

	/**
	 * @property {number} rate
	 */
	get rate() { return this._rate; }
	set rate(v) { this._rate = v;}

	/**
	 * @property {number} max - level up experience.
	 */
	get max() { return this._max; }
	set max(v) { this._max = v;}

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null){

		super(vars);

		this._max = this._max || 100;
		this._value = this._value || 0;
		this._exp = this._exp || 0;
		this._rate = this._rate || 1;

	}

	update( dt) {

		this._exp += dt*this._rate;
		if ( this._exp >= this._max ) this.levelUp();

	}

	percent() { return 100*(this._exp / this._max ); }

	levelUp() {

		if ( ++this._value > MAX_LEVEL ) this._value = MAX_LEVEL;

		this._exp -= this._max;
		this._max += this._max*EXP_RATIO;

	}

}