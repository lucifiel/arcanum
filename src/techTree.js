import Upgrade from './upgrade';
import * as PIXI from 'pixi.js';

export default class TechTree extends PIXI.utils.EventEmitter {

	/**
	 * {Object[id=>Upgrade]}
	 */
	get upgrades() { return this._upgrades;}
	set upgrades(v) { this._upgrades =v;}

	/**
	 * {Object[id=>Number]} Number of times an upgrade has been unlocked.
	 */
	get lockStatus() { return this._lockStatus; }
	set lockStatus(v) { this._lockStatus = v;}

	/**
	 * {Upgrade[]} Upgrades that can currently be unlocked.
	 */
	get fringe() { return this._fringe; }
	set fringe(v) { this._fringe = v; }

	/**
	 * 
	 * @param {Object} [vars=null] 
	 */
	constructor(vars=null){

		super();

		if ( vars) Object.assign( this, vars);

		this._upgrades = this._upgrades || {};
		this._lockStatus = this._lockStatus || {};

		this._fringe = [];

		let up;
		for( let p in this._upgrades ) {

			up = this._upgrades[p];

			// no requirements. add to fringe.
			if ( !up.requires ) {
				this._fringe.push(up);
				up.unlockable = true;
			}

		}


	}

	/**
	 * Refresh the list of upgrades that can be unlocked.
	 */
	refreshFringe() {

		let upgrades = this._upgrades;
		let up;

		for( let p of upgrades ) {

			up = upgrades[p];
			if ( up.unlockable === true || up.unlocked === true ) continue;

			// no requirements. add to fringe.
			if ( this.canUnlock(up) === true ) this._fringe.push(up);

		}

	}

	/**
	 * 
	 * @param {String} id 
	 */
	unlocked(id, count=0) {
		return this._lockStatus.hasOwnProperty(id) && this._lockStatus[id] > count;
	}

	/**
	 * 
	 * @param {String|Upgrade} id 
	 */
	canUnlock( id ) {

		let upgrade = (typeof id === 'string' ) ? this._upgrades[id] : id;

		if ( !upgrade) return false;

		let requires = upgrade.requires;
		if ( requires ) {

			if ( typeof requires === 'string') {

				if ( this.unlocked( requires ) === false ) return false;

			} else if ( requires instanceof Array ) {

				for( let i = requires.length-1; i>= 0; i-- ) {
					if ( this.unlocked(requires[i]) === false) return false;
				}

			} 

		}

		return true;

	}

	unlock(upgrade) {

		if ( this.canUnlock( upgrade ) === false ) return false;

		let cur = this._lockStatus[upgrade.id] || 0;
		this._lockStatus[upgrade.id] = cur+1;

		let id = this._fringe.indexOf( upgrade );
		if ( id >= 0 ) this._fringe.splice(id, 1 );

		this.emit( 'unlocked', upgrade );

		return true;

	}

}