import DataLoader from 'dataLoader';
import Spellbook from 'spellbook';
import Skill from 'items/skill';
import VarPath from './varPath';

import Log from 'log';
import GameState from './gameState';

/**
 * @constant {number} TICK_TIME - time in milliseconds between updates.
 */
export const TICK_TIME = 200;

/**
 * @constant {number} SELL_RATE - percent of initial cost
 * item sells for.
 */
const SELL_RATE = 0.5;

export default {

	/**
	 * @property {GameState} gameData
	 */
	get state() { return this._state; },
	set state(v) { this._state =v;},

	/**
	 * @property {Object.<string,Item>} items
	 */
	get items() { return this._items; },

	get curAction() { return this._state.curAction; },
	set curAction(v) { this._state.curAction = v; },

	/**
	 * @property {Log} log
	 */
	log:new Log(),

	init() {

		DataLoader.init();

		this._state = new GameState( DataLoader.gameData );
		this._items = this._state.items;

	},

	startRaid( dungeon) {

		this._state.raid.setDungeon(dungeon);
		this.curAction = this._state.raid;

	},

	/**
	 * Frame update.
	 */
	update() {

		let time = Date.now();
		let dt = ( time - this.lastUpdate )/1000;
		this.lastUpdate = time;

		this.doDots(dt);

		this.doAction( dt );

		this.doResources(dt);

	},

	/**
	 * Frame update of all resources.
	 * @param {number} dt - elapsed time. 
	 */
	doResources( dt ) {

		let stats = this._state.resources;
		let len = stats.length, stat;
		for( let i = len-1; i >= 0; i-- ) {

			stat = stats[i];
			if ( stat.locked === false ) {

				stats[i].update( dt );

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

		let updates = this._state.dots;
		let dot;

		for( let i = updates.length-1; i >= 0; i-- ) {

			dot = updates[i];
			dot.duration -= dt;
			if ( dot.duration <= 0 ) {

				updates.splice( i, 1 );
				if ( dot.mod ) {
					this.addMod( dot.mod, -1 );
				}

			} else {

				// ignore any remainder beyond 0.
				if ( dot.effect ) this.applyEffect( dot.effect, dt );

			}

		}

	},

	/**
	 * Performs tick update of the current action/skill.
	 * @param {number} dt - elapsed time 
	 */
	doAction( dt ) {

		let action = this._state.curAction;
		if ( !action ) return;

		if ( action.cost ) {

			if ( !this.canPay( action.cost, dt ) ) {
				this.stopAction()
				return;
			}
			this.payCost( action.cost, dt );

		}

		if ( action === this._state.raid ) {
			
			this._state.raid.update(dt);

		} else if ( action instanceof Skill ) {

			action.exp += dt;
			if ( action.exp >= action.max ) {
				action.levelUp();
			}

		} else {

			if ( action.effect ) this.applyEffect( action.effect, dt );
			if ( action.fill && this.filled(action.fill ) ) this.stopAction();

		}

	},

	/**
	 * Stops the current action.
	 * Attempts to resume any waiting action.
	 */
	stopAction() {

		let cur = this._state.curAction;
		let resume = this._state.resumeAction;
		if ( resume != null ) {

			this._state.curAction =
				resume !== cur ? resume : null;
			this._state.resumeAction = null;

		} else {

			let rest = this.getItem('rest');
			if ( cur !== rest ) {

				this._state.resumeAction = cur;
				this._state.curAction = rest;

			} else this._state.curAction = null;

		}

	},

	/**
	 * Tests if a named resource has been filled to max.
	 * @param {Resource|Resource[]} v 
	 */
	filled( v ) {

		if ( v instanceof Array ) return v.every( this.filled, this );

		let fill = v instanceof VarPath ? this.getPathItem( v ) : this.getItem(v);
		//console.log( 'fill ' + fill.id + ' ? ' + fill.value + ' / ' + fill.max.value );
		return fill.value >= fill.max.value;

	},

	/**
	 * 
	 * @param {Object} evt 
	 */
	doEvent( evt ) {

		if ( evt.remove ) this.remove( evt.remove);

		if ( evt.title ) this._state.player.title = evt.title;

		evt.locked = false;
		evt.value = 1;
		this._state.completed[evt.id] = evt;
		this._state.events[evt.id] = null;

		this.log.log( evt.name, evt.desc, 'event' );

	},

	/**
	 * Completely remove a previously unlocked/purchased item.
	 * @param {string|Item|Array} it 
	 */
	remove( it ) {

		if ( it instanceof Array ) for( let v of it ) this.remove(v);
		else {

			if ( typeof it === 'string' ) it = this.getItem( it );
			if ( it ) {

				it.removed = true;
	
				// remove all stat mods.
				if ( it.mod ) this.removeMod( it, it.value );

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

	tryLearn(it) {

		if ( it.cost ) {
			if ( !this.canPay(it.cost) ) return false;
			this.payCost( it.cost );
		}

		it.cost = it.cast || it.use;
		it.learned = true;

	},

	/**
	 * Attempt to pay for an item, and if the cost is met, apply it.
	 * @param {Item} it
	 * @returns {boolean}
	 */
	tryItem(it) {

		if ( it.cost ) {
			if ( !this.canPay(it.cost) ) return false;
			this.payCost( it.cost );
		}

		it.value++;

		if ( it.effect ) this.applyEffect(it.effect);
		if ( it.mod ) this.addMod( it.mod, 1 );

		if ( it.dot ) this.beginDot( it, it.dot );

		if ( it.repeat !== true ) this.remove(it);

		return true;

	},

	beginDot( it, dot ) {

		let id = it.id;

		let cur = this._state.dots.find( d=>d.id===id);
		if ( cur !== undefined ) cur.duration = dot.duration;
		else {

			this._state.dots.push( Object.assign( { id:id, name:it.name }, dot ) );
			if ( dot.mod ) {
				this.addMod( dot.mod, 1 );
			}

		}

	},

	/**
	 * Attempt to unlock an item.
	 * @param {Item} item
	 * @returns {boolean} true on success. 
	 */
	tryUnlock( item ) {

		if ( item.removed ) return false;
		if ( item.must && !this.lockTest(item.must,item)) return false;

		else if ( !item.require || this.lockTest(item.require,item) ) {
			item.locked = false;
		}

		return !item.locked;

	},

	/**
	 * Return the results of a testing object.
	 * @param {string|function|Object|Array} test
	 * @returns {boolean}
	 */
	lockTest( test, item ) {

		if ( test instanceof Array ) return test.every( this.lockTest, this );

		let type = typeof test;
		if ( type === 'function') {

			//console.log(test.toString());

			return test( this._items, item );

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
	 * @param {number} amt - amount added.
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
	 * @param {Object} mod 
	 * @param {number} amt 
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
	 * Determines whether an item can be run as a continuous action.
	 * @returns {boolean}
	 */
	runnable( it ) {

		return this.canPay( it.cost, TICK_TIME/1000 );

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

		if ( !item.repeat && item.value > 0 ) {
			console.log('cant buy: ' + item.id );
			return false;
		}
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
	 * Return a list of items containing given tags.
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
	},

	/**
	 * Get an item on an item-id varpath.
	 * @param {VarPath} v 
	 */
	getPathItem(v){
		return v.readVar( this._items );
	},

	/**
	 * 
	 * @param {string} id
	 * @returns {Item|undefined} 
	 */
	getItem(id) { return this._items[id]; },

}