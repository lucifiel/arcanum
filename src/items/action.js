import GData from './gdata';
import Game from '../game';
import Events, { ACT_DONE, ACT_IMPROVED } from '../events';

export default class Action extends GData {

	valueOf(){ return this.locked ? 0 : this._value; }

	get level() {return this._level;}
	set level(v) { this._level = v;}

	get ex(){return this._exp; }
	set ex(v) { this._exp = v;}

	get value() { return this._value; }
	set value(v) {
		this._value = v;
	}

	/**
	 * @property {number} exp - alias ex data files.
	 */
	get exp() { return this._exp || 0; }
	set exp(v){
		this._exp = v;
	}

	get length() { return this._length; }
	set length(v) { this._length = v;}

	/**
	 * @deprecated
	 */
	get progress() { return this._exp; }
	set progress(v){

		if ( v > this._exp && this.maxed()) return;
		this._exp = v;
		if ( this.length && v >= this._length ) {

			this.value++;

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

		this.restoreAtMods();

	}

	restoreAtMods() {

		let v = this._value;
		if ( this.at ) {

			for( let p in this.at) {

				if ( v >= Number(p) ) {
					this.applyMods( this.at[p] );
				}

			}

		}

	}

	/**
	 * Update a running action.
	 * @param {number} dt - elapsed time.
	 */
	update( dt ) {

		let v = this.exp += dt;

		if ( v >= ( this._length||1) ) {
			this.complete();
		}

	}

	/**
	 * completion of ongoing action.
	 */
	complete() {

		if ( this.log ) Game.doLog( this.log );
		if ( this.result ) Game.applyEffect( this.result );
		if ( this.mod ) Game.addMod( this.mod );
		if ( this.loot ) Game.getLoot( this.loot );

		this.value++;

		Events.dispatch( ACT_DONE, this );

		if ( this.exec ) this.exec();

	}

	canUse() {
		if ( this.maxed() ) return false;
		if ( this.cd > 0 && this.timer > 0 ) return false;
		return true;
	}

	/**
	 * Action executed, whether runnable or one-time.
	 */
	exec() {

		if ( this.cd ) {

			Game.addTimer( this );
			this.timer = this.cd;
		}

		if ( this.at ) {

			let cur = this.at[this.value];
			if ( cur ) {

				Events.dispatch( ACT_IMPROVED, this );
				this.applyMods( cur );

			}

		}
		this._exp = 0;

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

}