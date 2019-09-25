import Resource from "./resource";
import Stat from "../stat";

/**
 * A reversed Resource is 'filled' at 0 and bad at max.
 */
export default class RevStat extends Resource {

	valueOf() { return this.value; }

	/**
	 * Adding value => more space left.
	 * Removing value => increasing space used.
	 */
	set value(v){

		if ( v < 0 )this._value = 0;
		else if ( v > this._max.value ) this._value = this._max.value;

	}

	constructor( vars ){

		super(vars);

		if ( !this._max ) this._max = 0;

	}

	filled() { return this._value <= 0; }

	maxed() { return this._value <= 0; }

}