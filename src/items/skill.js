import Item from './item';
import Stat from '../stat';

const EXP_RATIO = 0.4;

export default class Skill extends Item {

	/**
	 * @property {number} level
	 */
	get level() { return this._value; }
	set level(v) { this._value =v; }

	/**
	 * @property {number} progress
	 */
	get progress() { return this._exp; }
	set progress(v) {
		this._exp=v;
		if ( v >= this._length ) this.complete();
	}

	/**
	 * @property {number} exp - alias for progress for clarity
	 * in data files.
	 */
	get exp() { return this._exp}
	set exp(v){this._exp =v;}

	/**
	 * @property {number} max - level up experience.
	 */
	get length() { return this._length; }
	set length(v) { this._length = v;}

	get max() { return this._max; }
	set max(v) { this._max = v instanceof Stat ? v : new Stat(v); }

	/**
	 * 
	 * @param {?Object} [vars=null] 
	 */
	constructor( vars=null){

		super(vars);

		this.type = 'skill';
		this.length = this.length || 50;
		this._value = this._value || 0;
		this._exp = this._exp || 0;
		this.rate = this.rate || 2;
		this.max = this.max || 5;

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
		console.log('Skill maxExp: ' + this._length );

	}

}