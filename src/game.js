import DataLoader from 'dataLoader';
import Resource from 'resource';
import Upgrade from 'upgrade';
import Action from 'action';

import Log from 'log';

export default {

	get gameData() { return this._gameData; },
	set gameData(v) { this._gameData =v;},

	get items() { return this._items; },

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

	update() {

		let time = Date.now();
		let dt = ( time - this.lastUpdate )/1000;
		this.lastUpdate = time;

		let stats = this._gameData.resources;
		let len = stats.length, stat;
		for( let i = len-1; i >= 0; i-- ) {

			stat = stats[i];
			if ( !stat.locked ) stats[i].update( dt );

		}

		for( let i = len-1; i>=0; i-- ) {

			stat = stats[i];
			if ( stat.delta !== 0 ) {

				if ( stat.mod ) this.addMod( stat.mod, stat.delta );

			}

		}

	},

	/**
	 * Attempt to pay for an action, and if the cost is met, apply it.
	 * @param {Action} act 
	 */
	tryAction(act) {

		if ( act.cost ) {
			if ( !this.canPay(act.cost) ) return false;
			this.payCost( act.cost );
		}

		if ( act.effect ) this.applyEffect(act.effect)

	},

	tryUnlock( item ) {

		//console.log('try unlock: ' + item.id );
		if ( !item.require ) {

			item.locked = false;

		} else if ( this.canUnlock(item.require) ) {

			item.locked = false;

		}

		return !item.locked;

	},

	/**
	 * Perform a test to unlock an item.
	 * @param {string|function|Object|Array} test 
	 */
	canUnlock( test ) {

		if ( test instanceof Array ) return test.every( this.canUnlock, this );

		let type = typeof test;
		if ( type === 'function') {

			//console.log(test.toString());

			return test( this._items );

		} else if ( type === 'string') {

			// test that another item is unlocked.
			let it = this.getItem(test);
			if ( it && !it.locked ) return true;

		} else if ( type === 'object') {

			//@todo
			return true;
		}

	},

	/**
	 * Apply a mod.
	 * @param {Array|Object} mod 
	 */
	addMod( mod, amt ) {

		console.log('adding mod: ' + mod + " : " + amt );
		if ( mod instanceof Array ) mod.forEach( this.addMod, this );
		else if ( mod instanceof Object ) {
	
			for( let p in mod ) {
				console.log('foundmod: ' + p);
				var target = this.getItem( p );
				if ( !target) continue;
				target.addMod( mod[p], amt );

			}

		}

	},

	removeMod( mod ) {
	},

	/**
	 * Perform the one-time effect of an action, resource, or upgrade.
	 * @param effect
	 */
	applyEffect( effect ) {

		if ( effect instanceof Array ) {

			for( let e of effect ) this.applyEffect(e);

		} else if ( effect instanceof Object ) {

			let target, e;
			for( let p in effect ){

				target = this.getItem(p);
				if ( target === undefined ) continue;

				e = effect[p];

				console.log(target.name + ": " + target.value );
				if ( !isNaN(e) ) target.value += e;
				else target.applyEffect(e);

			}

		} else if ( typeof effect === 'string') {

			effect = this.getItem(effect);
			if ( effect != null ) this.applyEffect( effect );
		}

	},

	/**
	 * Attempts to pay the cost to perform an action, buy an upgrade, etc.
	 * Before calling this function, ensure cost can be met with canPay()
	 * 
	 * @param {Array|Object} cost
	 */
	payCost( cost ) {

		if ( cost instanceof Array ) return cost.forEach( this.payCost, this );

		if ( cost instanceof Object ){

			for( let p in cost ) {

				var res = this.getResource(p);
				if ( res ) res.value -= cost[p];

			}

		} else {
		}

	},

	/**
	 * Determine if an object cost can be paid before the pay attempt
	 * is actually made.
	 * @param {Array|Object} cost
	 * @returns {boolean} true if cost can be paid.
	 */
	canPay( cost ) {

		if ( cost instanceof Array ) return cost.every( this.canPay, this );

		if ( cost instanceof Object ){

			for( let p in cost ) {

				var res = this.getResource(p);
				if ( !res || res.value < cost[p] ) return false;

			}


		} else {
			return true;
		}

		return true;
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

			res = new Resource( def );
	
			resources.push( res );
			resById[ def.id ] = this._items[ def.id ] = res;

		}

	},

	initUpgrades() {

	},

	initActions() {

		let actions = this._gameData.actions = [];

		let act;
		for( let def of DataLoader.actionList ) {

			act = new Action( def );
			actions.push(act);
			this._items[act.id] = act;

		}

	}

}