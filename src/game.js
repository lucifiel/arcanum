import DataLoader from 'dataLoader';
import Resource from 'items/resource';
import Upgrade from 'items/upgrade';
import Action from 'items/action';
import Spellbook from 'spellbook';
import Skill from 'items/skill';
import Player from 'player';

import Log from 'log';

/**
 * @constant {number} SELL_RATE - percent of initial cost
 * item sells for.
 */
const SELL_RATE = 0.5;

export default {

	get gameData() { return this._gameData; },
	set gameData(v) { this._gameData =v;},

	/**
	 * @property {Object.<string,Item>} items
	 */
	get items() { return this._items; },

	get flags() { return this._flags; },

	log:new Log(),

	init() {

		this._flags = {};

		DataLoader.init();

		this._items = DataLoader.items;
		this._gameData = DataLoader.gameData;

		this._player = this._gameData.player = new Player();

		/**
		 * @property {Item} curAction - ongoing action.
		 */
		this._gameData.curAction = null;

		/**
		 * timed/ongoing effects.
		 */
		this._gameData.dots = [];

		this.tagItems( it=>it.typeCost('space')>0, 'furniture' );

		/**
	 	* @property {Object} events - available events.
	 	*/
		this._events = this._gameData.events;

		/**
		 * @property {Object} completed - completed events.
		 */
		this._completed = this._gameData.completed = {};

	},

	/**
	 * 
	 * @param {string} id
	 * @returns {Resource|Upgrade|Action} 
	 */
	getItem(id) {
		return this._items[id];
	},

	update() {

		let time = Date.now();
		let dt = ( time - this.lastUpdate )/1000;
		this.lastUpdate = time;

		this.doDots(dt);

		// active skill, if any.
		this.doAction( dt );

		this.doResources(dt);

	},

	doResources( dt ) {

		let stats = this._gameData.resources;
		let len = stats.length, stat;
		for( let i = len-1; i >= 0; i-- ) {

			stat = stats[i];
			if ( stat.locked === false ) {

				if ( stat.must && !this.lockTest( stat.must ) ) stat.locked = true;
				else stats[i].update( dt );

			}

		}

		// apply mods for stat changes.
		for( let i = len-1; i>=0; i-- ) {

			stat = stats[i];
			if ( stat.delta !== 0 ) {

				if ( stat.mod ) this.addMod( stat.mod, stat.delta );

			}

		}

	},

	/**
	 * Perform any update effects.
	 * @param {number} dt - elapsed time.
	 */
	doDots( dt ) {

		let updates = this._gameData.dots;
		let efx;

		for( let i = updates.length-1; i >= 0; i-- ) {

			efx = updates[i];
			efx.duration -= dt;
			if ( efx.duration < 0 ) updates.splice( i, 1 );
			// ignore any remainder beyond 0.
			this.updateDot( efx, dt );

		}

	},

	/**
	 * Performs tick update of the current action/skill.
	 * @param {*} dt 
	 */
	doAction( dt ) {

		let action = this.gameData.curAction;
		if ( !action ) return;

		if ( action.cost ) {

			if ( !this.canPay( action.cost, dt ) ) {
				this.stopAction(action)
				return;
			}
			this.payCost( action.cost, dt );

		}

		if ( action instanceof Skill ) {

			action.exp += dt;
			if ( action.exp >= action.max ) {
				action.levelUp();
			}

		} else {

			if ( action.effect ) this.applyEffect( action.effect, dt );
			if ( action.fill) {
				let fill = this.getItem(action.fill);
				if ( fill && fill.value >= fill.max.value ) this.stopAction( action );
			}

		}

	},

	stopAction( cur ) {

		let resume = this.gameData.resumeAction;
		if ( resume != null ) {

			this.gameData.curAction =
				resume !== cur ? resume : null;
			this.gameData.resumeAction = null;

		} else {

			let rest = this.getItem('rest');
			if ( cur !== rest ) {

				this.gameData.resumeAction = cur;
				this.gameData.curAction = rest;

			} else this.gameData.curAction = null;

		}

	},

	/**
	 * 
	 * @param {Object} evt 
	 */
	doEvent( evt ) {

		if ( evt.remove ) this.remove( evt.remove);

		evt.locked = false;
		evt.value = 1;
		this._completed[evt.id] = evt;
		this._events[evt.id] = null;

		this.log.log( evt.name, evt.desc, 'event' );

	},

	/**
	 * Completely remove a previously unlocked/purchased item.
	 * @param {*} what 
	 */
	remove( what ) {

		if ( what instanceof Array ) for( let it of what ) this.remove(it);
		else {

			let it = this.getItem( what );
			if ( it ) {

				delete this._items[it.id];

				// @todo - remove from relevant list? code below is wrong
				// because type string doesn't match list name.
				//let typeList = this.gameData[it.type];
				//let ind = typeList.indexOf( it );
				//if ( ind >= 0 ) typeList.splice(ind,1);
	
				// remove all stat mods.
				if ( it.mod ) this.removeMod( it, it.value );
				it.value = 0;

			}

		}
	},

	/**
	 * Attempt to sell one unit of an item.
	 * @param {Item} it
	 * @returns {boolean}
	 */
	trySell(it) {

		if ( it.value < 1 ) return false;

		let costObj = it.cost;
		if ( !isNaN(costObj) ) {

			this.getItem('gold').value += costObj*SELL_RATE;

		} else if ( costObj instanceof Object ) {

			if ( costObj.gold ) this.getItem('gold').value += costObj.gold*SELL_RATE;
			if ( costObj.space ) this.getItem('space').value += costObj.space;

		}

		it.value -= 1;

		if ( it.mod ) this.removeMod( it, 1 );

		return true;

	},

	/**
	 *
	 * @param {*} up 
	 */
	tryUpgrade(up){

		if ( up.cost ) {
	
			if ( !this.canPay(up.cost) ) {
				this.log.log('', 'Cannot afford upgrade.');
				return false;
			}
			this.payCost( up.cost );
		}

		up.value++;

		if ( up.effect ) this.applyEffect(up.effect);
		if ( up.mod ) this.addMod( up.mod, 1 );

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

		if ( item.must && !this.lockTest(item.must)) return false;

		else if ( !item.require || this.lockTest(item.require) ) {
			item.locked = false;
		}

		return !item.locked;

	},

	/**
	 * Return the results of a testing object.
	 * @param {string|function|Object|Array} test 
	 */
	lockTest( test ) {

		if ( test instanceof Array ) return test.every( this.lockTest, this );

		let type = typeof test;
		if ( type === 'function') {

			//console.log(test.toString());

			return test( this._items );

		} else if ( type === 'string') {

			// test that another item is unlocked.
			let it = this.getItem(test);
			if (!it) return false;
			if ( it.type === 'resource' || it.type === 'action') return !it.locked;
			return it.value >0;

		} else if ( type === 'object') {

			//@todo
			return true;
		}

	},

	/**
	 * Apply a mod.
	 * @param {Array|Object} mod
	 * @param {amt} amt - amount added.
	 */
	addMod( mod, amt ) {

		if ( mod instanceof Array ) mod.forEach( this.addMod, this );
		else if ( mod instanceof Object ) {
	
			for( let p in mod ) {

				var target = this.getItem( p );
				if ( !target) continue;
				target.addMod( mod[p], amt );

			}

		}

	},

	/**
	 * 
	 * @param {*} mod 
	 * @param {*} amt 
	 */
	removeMod( mod, amt ) {
		this.addMod( mod, -amt);
	},

	/**
	 * Perform the one-time effect of an action, resource, or upgrade.
	 * @param effect
	 */
	applyEffect( effect, dt=1 ) {

		if ( effect instanceof Array ) for( let e of effect ) this.applyEffect(e);

		else if ( effect instanceof Object ) {

			if ( effect.duration ) this._gameData.dots.push( Object.assign( {}, effect ) );

			let target, e;
			for( let p in effect ){

				target = this.getItem(p);
				if ( target === undefined ) continue;

				e = effect[p];

				if ( !isNaN(e) ) target.value += e*dt;
				else if ( target.type === 'event' ) this.doEvent( target );
				else target.applyEffect(e,dt);

			}

		} else if ( typeof effect === 'string') {

			effect = this.getItem(effect);
			if ( effect != null ) {

				if ( effect.type === 'event') this.doEvent( effect );
				else this.applyEffect( effect, dt );

			}

		}

	},

	/**
	 * Update a timed effect.
	 * @param {Object|string|Effect} effect 
	 * @param {number} dt - elapsed time. 
	 */
	updateDot( effect, dt ) {

		if ( effect instanceof Array ) for( let e of effect ) this.updateDot(e, dt);

		else if ( effect instanceof Object ) {

			let target, e;
			for( let p in effect ){

				target = this.getItem(p);
				if ( target === undefined ) continue;

				e = effect[p];

				if ( !isNaN(e) ) target.value += e*dt;
				else target.updateDot(e);

			}

		} else if ( typeof effect === 'string') {

			effect = this.getItem(effect);
			if ( effect != null ) this.updateDot( effect, dt );
		}

	},

	/**
	 * Attempts to pay the cost to perform an action, buy an upgrade, etc.
	 * Before calling this function, ensure cost can be met with canPay()
	 * 
	 * @param {Array|Object} cost
	 */
	payCost( cost, unit=1) {

		if ( cost instanceof Array ) return cost.forEach( v=>this.payCost(v,unit), this );

		let res;
		if ( cost instanceof Object ){

			for( let p in cost ) {

				res = this.getItem(p);
				if ( res ) res.value -= cost[p]*unit;

			}

		} else if ( !isNaN(cost ) ) {

			res = this.getItem('gold');
			if ( res ) res.value -= cost*unit;

		}

	},

	canBuy( item ){

		if ( !item.repeat && item.value > 0 ) return false;
		return !item.cost || this.canPay(item.cost);
	},

	/**
	 * Determine if an object cost can be paid before the pay attempt
	 * is actually made.
	 * @param {Array|Object} cost
	 * @returns {boolean} true if cost can be paid.
	 */
	canPay( cost, unit=1 ) {

		if ( cost instanceof Array ) return cost.every( v=>this.canPay(v,unit), this );

		let res;

		if ( cost instanceof Object ){

			for( let p in cost ) {

				res = this.getItem(p);
				if ( !res || res.value < cost[p]*unit ) return false;

			}


		} else if (!isNaN(cost) ) {

			res = this.getItem('gold');
			if ( res.value < cost*unit) return false;

		}

		return true;
	},

	/**
	 * 
	 * @param {(it)=>boolean} pred 
	 */
	filterItems( pred ) {
		let a = [];
		let items = this._items;
		for( let p in items ) {
			if ( pred( items[p] ) ) a.push( items[p] );
		}
		return a;
	},

	/**
	 * Return a list of items containing give tags.
	 * @param {string[]} tags
	 * @returns {Item[]}
	 */
	filterByTag( tags ) {

		let a = [];
		for( let p in this._items ) {
			if ( this._items[p].hasTags(tags) ) a.push(this._items[p]);
		}
		return a;
	
	},
	
	/**
	 * Assign all items passing the predicate test the given tag.
	 * @param {Predicate} test 
	 * @param {string} tag 
	 */
	tagItems( test, tag ) {
		let items = this._items;
		for( let p in items ) {
			if ( test( items[p] ) ) items[p].addTag(tag);
		}
	}

}