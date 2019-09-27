import Resource from "./resource";
import Stat from "../stat";

/**
 * A reversed Resource is 'filled' at 0 and bad at max.
 */
export default class RevStat extends Resource {

	constructor( vars ){

		super(vars);

		if ( !this._max ) this.max = 0;
		this._value = this._value || 0;

	}

	filled() { return this._value <= 0; }

	maxed() { return this._value < 0; }

}