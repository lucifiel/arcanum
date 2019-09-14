import GData from './gdata';
import Game from '../game';
import Events from '../events';

export default class Action extends GData {

	valueOf(){ return this.locked ? 0 : this._value; }

	get level() {return this._level;}
	set level(v) { this._level = v;}

	get ex(){return this._exp; }
	set ex(v) { this._exp = v;}

	/**
	 * @property {number} exp - alias progress data files.
	 */
	get exp() { return this._exp || 0; }
	set exp(v){

		this._exp = v;
		if ( Game.loaded && this.length && v >= this._length ) {

			this.value++;

			if ( this.log ) Game.doLog( this.log );
			if ( this.result ) Game.applyEffect( this.result );
			if ( this.loot ) Game.getLoot( this.loot );
			if ( this.exec ) this.exec();
			this.complete();

		}
	}

	get length() { return this._length; }
	set length(v) { this._length = v;}

	get progress() { return this._exp; }
	set progress(v){

		if ( v > this._exp && this.maxed()) return;
		this._exp = v;
		if ( this.length && v >= this._length ) {

			this.value++;

			console.log('APPLY ACTION EFFECT: ' +  this.id );
			if ( this.result ) Game.applyEffect( this.result );
			if ( this.loot ) Game.getLoot( this.loot );
			this.complete();

		}
	}

	percent() {
		return 100*(this._exp / this._length );
	}

	constructor( vars=null ){

		super(vars);

		this.repeat = this.repeat === false ? false : true;
		this.type = 'action';
		if ( this.length ) this._exp = this._exp || 0;

		if ( this.cd ) this.timer = this.timer || 0;
	}

	canUse() {
		if ( this.maxed() ) return false;
		if ( this.cd > 0 && this.timer > 0 ) return false;
		return true;
	}

	exec() {
		if ( this.timer > 0 ) return false;
		if ( this.cd ) {

			Game.addTimer( this );
			this.timer = this.cd;
		}

	}

	/**
	 * Performs a timer tick.
	 * @param {number} dt - elapsed time.
	 * @returns {boolean} true if timer is complete.
	 */
	tick( dt) {

		if ( this.timer > 0 ) {

			//console.log('timer: ' + this.timer );
			this.timer -= dt;
			if ( this.timer > 0 ) return false;
			else {
				this.timer = 0;
				return true;
			}

		}
		return false;

	}

	complete() {
		this._exp = 0;
	}

}