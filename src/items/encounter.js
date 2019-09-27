import GData from "./gdata";
import Game from '../game';
import Events, { ENC_DONE } from "../events";

const defaults = {

	level:1,
	locked:false

};

/**
 * Sublocation of a Locale
 */
export default class Encounter extends GData {

	get isProto() {return true; }

	/**
	 * @property {number} ex - clone for raw data getter/setters
	 */
	get ex() { return this._exp;}
	set ex(v) { this._exp = v;}

	get exp() { return this._exp;}
	set exp(v) { this._exp = v;}

	/**
	 *
	 */
	get length() { return this._length; }
	set length(v) { this._length = v;}

	toJSON() {
		if ( this.value > 0 ) return { value:this.value};
		else return undefined;
	}

	clone() { return new Encounter( this ); }

	constructor(vars=null) {

		super(vars );

		this.type = 'enc';

		for( var p in vars ) {
			console.log('ENC assign var: ' + p );
		}

		this.level = this.level || 1;
		this.length = this.length || 5*this.level;

	}

	revive(gs) {
	}

	update( dt ){

		this._exp += dt;
		if ( this.effect ) Game.applyEffect( this.effect, dt );

	}

	maxed() { return false; }

}