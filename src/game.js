import DataLoader from 'dataLoader';
import Resource from 'resource';
import Upgrade from 'upgrade';
import Action from 'action';

import Log from 'log';

export default {

	get gameData() { return this._gameData; },
	set gameData(v) { this._gameData =v;},

	log:Log,

	init() {

		DataLoader.init();

		this.initGameData();

	},

	/**
	 * 
	 * @param {string} id
	 * @returns {Resource} 
	 */
	getResource( id ) {
		return this._resourcesById[id];
	},

	/**
	 * 
	 * @param {string} id
	 * @returns {Resource|Upgrade|Action} 
	 */
	getItem(id) {
		return this._items[id];
	},

	addCount( name, count ) {

		let res = this.getItem(name);
		if ( res === undefined ) return;

		res.value += count;
		if ( res.effect ) {
			this.applyEffect( res.effect );
		}

	},

	/**
	 * Perform the effect of an action, resource, or upgrade.
	 * @param effect
	 */
	applyEffect( effect ) {

		if ( effect instanceof Array ) {

			for( let e of effect ) this.applyEffect(e);

		} else if ( effect instanceof Object ) {

			let it;
			for( let p in effect ){

				it = this.getItem(p);
				if ( it !== undefined ) it.applyEffect( effect[p] );
			}

		}

	},

	initGameData() {

		this._gameData = {};
		this._items = {};

		this.initResources();
		this.initUpgrades();
		this.initActions();

	},

	initResources(){

		let resources = this._gameData.resources = [];
		let resById = this._resourcesById = {};
		let res;

		for( let def of DataLoader.resourceList ) {

			res = new Resource();
			res.def = def;
	
			resources.push( res );
			resById[ def.id ] = this.items[ def.id ] = res;

		}

	},

	initUpgrades() {

	},

	initActions() {
	}

}