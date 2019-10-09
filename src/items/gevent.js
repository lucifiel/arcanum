import GData from "./gdata";
import Events, { EVT_EVENT } from "../events";

/**
 * Represents in-game event.
 */
export default class GEvent extends GData {

	/**
	 * @property {number} rand - 100-based percent chance per 100 seconds
	 * for event to occur. indicates a randomized event.
	 */
	get rand() { return this._rand; }
	set rand(v) { this._rand = v; }

	get cd() { return this._cd; }
	set cd(v) { this._cd =v; }

	constructor(vars=null){

		super(vars);

	}

	/*topoff( amt ) {
		if ( !this.repeat && amt>0&& this.value >= 1 ) return 0;
		return amt;
	}*/

	amount( g, amt ) {

		console.log('EVENT: ' + this.id );
		if ( !super.amount(g,amt) ) return;


		this.locked = false;
		Events.emit( EVT_EVENT, this );

	}

}