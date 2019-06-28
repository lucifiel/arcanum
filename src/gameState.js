import Raid from './raid';

export default class GameState {

	constructor(vars=null ){

		if ( vars ) Object.assign( this, vars );

		/**
		 * @property {Item} curAction - ongoing action.
		 */
		this.curAction = this.curAction || null;

		this.dungeon = this.dungeon || null;

		this.curEnemy = this.curEnemy || null;

		/**
		 * @property {Object[]} dots - timed/ongoing effects.
		 */
		this.dots = this.dots || [];

		this.flags = this.flags || {};

		this.events = this.events || {};

		/**
		* @property {Object} completed - completed events.
		*/
		this.completed = this.completed || {};

		this.raid = this.raid || new Raid();
		this.raid.initState( this );

	}

	getItem(id) { return this.items[id];}

}