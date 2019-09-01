import Item from './item';
import Game from '../game';

export default class Action extends Item {

	valueOf(){ return this.locked ? 0 : this._value; }

	get level() {return this._value;}
	set level(v) { this._value =v;}

	/**
	 * @property {number} exp - alias progress for clarity
	 * in data files.
	 */
	get exp() { return this._exp || 0; }
	set exp(v){ this._exp =v; }

	get length() { return this._length; }
	set length(v) { this._length = v;}

	get progress() { return this._exp; }
	set progress(v){
		this._exp = v;
		if ( this.length && v >= this._length ) {

			this.value++;
			// intentional no wrap around, so costs repeat on restart.
			this._exp = 0;
			this.dirty = true;
			if ( this.complete ) this.complete();
			if ( this.result ) Game.applyEffect( this.result );
			if ( this.loot ) Game.getLoot( this.loot );

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
	}

	exec() {
		if ( this.timer > 0 ) return false;
		if ( this.cd ) {
			Game.addTimer( this );
			this.timer = cd;
		}

	}

	/**
	 * Performs a timer tick.
	 * @param {number} dt - elapsed time.
	 * @returns {boolean} true if timer is complete.
	 */
	tick( dt) {

		if ( this.timer > 0 ) {

			this.timer -= dt;
			if ( this.timer > 0 ) return true;
			this.timer = 0;

		}
		return false;

	}

}