import DataLoader from './dataLoader';
import { logObj} from './util/util';
import GData from './items/gdata';
import Log from './log.js';
import GameState, { REST_SLOT } from './gameState';
import Range from './values/range';
import ItemGen from './itemgen';
import TechTree from './techTree';

import Events, {EVT_UNLOCK, EVT_EVENT, EVT_LOOT, ENTER_LOC, EXIT_LOC, SET_SLOT, TRY_USE, DELETE_ITEM } from './events';
import Resource from './items/resource';
import Skill from './items/skill';
import Stat from './values/stat';
import { TEAM_ALLY } from './chars/npc';

var techTree;

/**
 * @constant {number} TICK_TIME - time in milliseconds between updates.
 */
export const TICK_TIME = 200;

/**
 * @constant {number} EVT_TIME - time for checking randomized events.
 */
export const EVT_TIME = 1000;

export default {

	toJSON() { return JSON.stringify( this.state ); },

	/**
	 * @property {GameState} gameData
	 */
	state:null,

	/**
	 * @property {Object.<string,Item>} items
	 */
	get items() { return this._items; },

	/**
	 * Not really used any more.
	 * @property {boolean} loaded - true when data is ready and game ready to play.
	 */
	loaded:false,

	/**
	 * @property {ItemGen} itemGen - item generator/instancer object.
	 */

	/**
	 * @property {Log} log
	 */
	log:new Log(),

	/**
	 * @property {Runner} runner - runs active actions.
	 */
	runner:null,

	get player(){return this.state.player},

	/**
	 *
	 * @param {*} obj
	 * @param {(number)=>boolean} obj.tick -tick function.
	 */
	addTimer( obj ){ this.runner.addTimer(obj); },

	/**
	 * Clear game data.
	 */
	reset() {
		this.loaded = false;
		this.state = null;
		this._items = null;
	},

	/**
	 *
	 * @param {*} saveData
	 * @param {.<string,GData>} hallData - data items from wizard hall.
	 * @returns {Promise.<GameState>}
	 */
	load( saveData=null, hallData=null ) {

		this.reset();

		this.log.clear();

		// Code events. Not game events.
		Events.init(this);

		this.runner = null;

		return this.loader = DataLoader.loadGame( saveData ).then( allData=>{

			this.state = new GameState( allData, saveData );
			this.itemGen = new ItemGen( this.state );

			this._items = this.state.items;

			this.runner = this.state.runner;

			if ( hallData ) this.addData( hallData );
			this.recheckTiers();
			this.restoreMods();

			techTree = new TechTree( this._items );

			Events.add( EVT_UNLOCK, techTree.unlocked, techTree );

			// initial fringe check.
			techTree.forceCheck();

			Events.add( ENTER_LOC, this.enterLoc, this );
			Events.add( EXIT_LOC, this.enterLoc, this );
			Events.add( SET_SLOT, this.setSlot, this );
			Events.add( DELETE_ITEM, this.onDelete, this );

			this.loaded = true;

			return this;

		}, err=>{ console.error( err.message + '\n' + err.stack )} );

	},

	/**
	 *
	 * @param {string} id
	 */
	logStat( id, full ) {

		let s = this.getData(id);
		if ( !s ) console.warn('STAT MISSING: '+id);
		else {

			if ( full ) logObj(s,'LOG STAT' );
			console.warn( id + ' value: ' + s.value );
			console.log( s.constructor.name );

		}
	},

	recheckTiers() {

		let highClass = '';

		let n = -1;
		while ( ++n <= 5 ) {

			var list = this.state.getTagList('t_tier'+n);
			var evt = this.state.getData('tier'+n);

			var hasEvent = false;

			for( var i = list.length-1; i>= 0; i-- ) {

				if ( list[i].value > 0) {

					highClass = list[i].name;
					if ( evt.locked ) evt.locked = false;
					else if ( evt.value == 0 ) {

						evt.doUnlock(this);
					}
					hasEvent = true;
					break;
				}

			}
			// none of this tier.
			if ( !hasEvent ) evt.value = 0;

		}
		if ( highClass && !this.state.player.gclass ) {
			this.state.player.setClass( highClass );
		}

	},

	/**
	 * Reapply mods for all owned items.
	 */
	restoreMods() {

		let items = this.state.items;

		this.state.player.begin();

		for( let p in items ) {

			var it = items[p];

			if ( !it.locked && !it.disabled ) {

				if ( it.value > 0 ) {


					if ( it.mod ) this.addMod( it.mod, it.value );
					if ( it.lock ) {
						this.lock( it.lock, it.value );
					}

				}

			}

		}
		for( let e of this.state.equip ) {
			if ( e.mod ) this.addMod( e.mod, 1 );
		}

	},

	/**
	 * Add data item to running game.
	 * This is currently so Hall data can be patched into every
	 * loaded game.
	 * @param {Object.<string,GData>} data
	 */
	addData( data ) {

		console.warn('HALL GAME DATA: ' + data );

		for( let p in data ) {

			let it = data[p];
			console.warn('ADDING DATA ITEM: ' + p + ': '+ it.valueOf() );
			this.state.addItem(it);
		}

	},

	setSlot( it ) {

		let cur = this.state.getSlot( it.slot );
		if ( cur ) { this.remove( cur, 1 );}

		this.state.setSlot( it.slot, it );

		this.payCost( it.cost );
		return it.amount( this );

	},

	enterLoc( locale, enter=true ) {

		let control = locale.type === 'dungeon' ? this.state.raid : this.state.explore;
		if ( enter ) {

			control.enter( locale );
			this.setAction( control );

		} else {

			control.locale = null;
			this.haltAction( control );

		}

	},

	/**
	 * Frame update.
	 */
	update() {

		let time = Date.now();
		let dt = Math.min( ( time - this.lastUpdate )/1000, 1 );
		this.lastUpdate = time;

		this.state.player.update(dt);
		this.state.minions.update(dt);

		this.runner.update(dt);

		this.doResources( this.state.resources, dt);
		this.doResources( this.state.playerStats, dt );
		this.doResources( this.state.stressors, dt );

		techTree.checkFringe();

	},

	/**
	 * Frame update of all resources.
	 * @param {number} dt - elapsed time.
	 */
	doResources( stats, dt ) {

		let len = stats.length, stat;
		for( let i = len-1; i >= 0; i-- ) {

			stat = stats[i];
			if ( stat.locked === false && !stat.disabled ) {

				if  ( stat.rate.value !== 0 ) {

					stat.amount(this, stat.rate.value*dt);

				}

			}

		}

	},

	/**
	 * Toggles an action on or off.
	 * @param {GData} a
	 */
	toggleAction(a) { this.runner.toggleAct(a); },

	/**
	 * Wrapper for Runner rest
	 */
	doRest() { this.runner.tryAdd( this.state.getSlot(REST_SLOT) ) },

	haltAction(a) { this.runner.stopAction(a);},

	setAction( a ) { this.runner.setAction(a); },

	/**
	 * Tests if an action has effectively filled a resource.
	 * @param {string|string[]} v - data or datas to fill.
	 * @param {GData} a - action doing the filling.
	 * @param {string} - name of relavant filling effect ( for tag-item fills)
	 */
	filled( v, a, tag ) {

		if ( Array.isArray(v) ) {
			for( let i = v.length-1; i>=0; i-- ) {
				if ( !this.filled( v[i], a, tag ) ) return false;
			}
			return true;
		}

		let fill = this.getData(v);
		if (fill === undefined ) {

			fill = this.state.getTagList( v );
			return fill === undefined ? true : this.filled(fill, a, v );

		}

		if ( !fill.rate || !a.effect || fill.rate.value >= 0 ) return fill.maxed();

		// actual filling rate.
		tag = a.effect[ tag || v ];

		return ( !tag || fill.filled(tag ) );

	},

	/**
	 * Completely disable an item - cannot be purchased/used/etc.
	 * @param {string|GData|Array} it
	 */
	disable( it ) {

		if ( Array.isArray(it) ) for( let v of it ) {
			this.disable(v);
		} else {

			if ( typeof it === 'string' ) {

				let item = this.getData( it );
				if ( !item ) {

					let list = this.state.getTagList(it);
					if ( list ) for( let v of list ) this.disable(v);
					return;

				} else it = item;

			}

			if ( it && !it.disabled ) {

				it.disabled = true;

				if ( it.slot && this.state.getSlot(it.slot, it.type) === it ) {
					this.remove( it, 1 );
				}

				if ( it.running ) this.runner.stopAction(it);
				if ( it == this.state.raid.dungeon ) this.state.raid.setDungeon(null);

				if ( it instanceof Resource || it instanceof Skill ) {
					this.remove( it, it.value);

				} else if ( it.mod ) {
					//console.log('REMOVING MOD: ' + it.id + ' --> ' + it.value );
					this.removeMod( it.mod, it.value );
				}

			}

		}
	},

	sellPrice( it ) {

		let sellObj = it.sell || it.cost || (5*it.level) || 5;

		if ( typeof sellObj === 'object' ) {
			sellObj = sellObj.gold || it.level || 1;
		}
		return Math.ceil( sellObj*this.state.sellRate );


	},

	/**
	 * Attempt to sell one unit of an item.
	 * @param {GData} it
	 * @param {Inventory}
	 * @param {number} count - positive count of number to sell.
	 * @returns {boolean}
	 */
	trySell( it, inv, count=1 ) {

		if ( it.value < 1 && !it.instance ) {
			return false; }

		if ( count > it.value ) {

			count = it.valueOf();
			it.value = 0;

		} else it.value -= count;

		let sellObj = it.sell || it.cost;
		let goldPrice = count*this.sellPrice(it);

		if ( sellObj && typeof sellObj === 'object' ) {
			if ( sellObj.space ) this.getData('space').value += count*sellObj.space;
		}
		this.getData('gold').value += goldPrice;

		if ( it.slot && this.state.getSlot(it.slot) === it ) this.state.setSlot(it.slot,null);

		if ( inv && it.instance ) {

			console.log('remainig: ' + it.value );
			if ( !it.stack || it.value <= 0 ) inv.remove( it );

		} else {

			if ( it.mod ) this.addMod( it.mod, -count );

		}

		return true;

	},

	/**
	 * Remove all quantity of an item.
	 * @param {string|string[]|GData|GData[]} it
	 */
	removeAll( it ){

		if ( typeof it === 'object' ) {

			this.remove( it, it.value );

		} else if ( Array.isArray(it)) {
			it.forEach( this.removeAll, this );

		} else {

			let item = this.getData( it );
			if ( item ) this.remove( it, it.value );
			else {

				item = this.state.getTagList( it );
				if ( item ) item.forEach( this.removeAll, this );

			}

		}

	},

	/**
	 * Attempt to pay the cost to permanently buy an item.
	 * @param {GData} it
	 * @param {boolean} keep
	 * @returns {boolean}
	 */
	tryBuy( it, keep=false ) {

		if ( this.canPay(it.buy) === false ) return false;
		this.payCost( it.buy );

		if ( it.isRecipe ) this.create( it, keep );
		it.owned = true;

		if ( it.slot && !this.state.getSlot(it.slot) ) this.setSlot(it);

		return true;

	},

	/**
	 * Use inventory or equip item.
	 * @param {*} it
	 */
	use( it, targ, inv=null ) {

		it.onUse( this );

	},

	/**
	 * Attempt to pay for an item, and if the cost is met, apply it.
	 * @param {GData} it
	 * @returns {boolean} - true if item is used. note that 'buying' an item
	 * does not actually use it, and returns false.
	 */
	tryItem(it) {

		if ( !it) return;

		if ( it.type ==='dungeon' || it.type === 'locale') return this.enterLoc(it);

		if ( !this.canUse(it) ) return false;

		if ( it.instance ){

			it.onUse( this);

		} else if ( it.buy && !it.owned ) {

			this.tryBuy(it);

		} else {

			if ( it.isRecipe ) {

				this.craft(it );

			} else if ( it.perpetual || it.length > 0 ) {

				this.setAction(it);

			} else {

				if ( it.slot ) this.setSlot( it );
				else {
					this.payCost( it.cost );
					it.amount( this );
				}
			}

		}

	},

	/**
	 * Craft an item by paying its cost, then instantiating it.
	 * Note that a crafted item does not use any of its effects or abilities.
	 * @param {*} it
	 */
	craft( it ) {

		if ( !this.canPay( it.cost ) ) return false;
		this.payCost( it.cost );

		this.create( it );

	},

	/**
	 * Custom item deleted from game.
	 * @param {*} it
	 */
	onDelete(it) {
		this.state.deleteItem(it);
	},

	/**
	 * Create instance from data.
	 * @param {string|Object} data
	 */
	instance( data ) {

		if ( typeof data === 'string') data = this.state.getData(data);

		return this.itemGen.instance(data);

	},

	/**
	 * Create an item whose cost has been met ( or been provided by an effect )
	 * @param {*} it
	 */
	create( it, keep=false ) {

		/**
		 * create monster and add to inventory.
		 * @todo this is hacky.
		*/
		if ( it.type === 'monster' ) {

			if ( it.onCreate ) it.onCreate( this, TEAM_ALLY, keep );

		} else {

			var inst = this.itemGen.instance( it );
			if ( inst ) this.state.inventory.add( inst );

		}


	},

	/**
	 *
	 * @param {GData} it
	 * @param {GData} targ - enchant target.
	 */
	tryUseOn( it, targ ) {

		if ( targ === null || targ === undefined ) return;

		if ( it.buy && !it.owned ) {

			this.payCost( it.buy );
			it.owned = true;

		} else {

			if ( !it.length ) {

				this.payCost( it.cost );
				this.useOn( it, targ );

			} else {

				// runner will handle costs.
				this.runner.useOn( it, targ );

			}
		}

	},

	/**
	 * Use an item in conjunction with another item.
	 * Item is used immediately. No running or costs necessary.
	 * The item effects/modifiers are applied to the target.
	 * @param {GData} it
	 * @param {GData} targ - use target.
	 */
	useOn( it, targ ) {

		if ( targ === null || targ === undefined ) return;

		if ( typeof it.useOn === 'function') it.useOn( targ );
		it.value++;

		console.log('USING: ' + it.id  + ' with ' + targ.id );

		if ( it.mod ) targ.permVars( it.mod );
		if ( it.effect ) targ.permVars( it.effect );

	},


	fillItem( id ) {

		let it = this.getData(id);
		if ( !it || !it.max ) return;

		let del = it.max.value - it.value;
		if ( del > 0) it.amount( this, it.max.value - it.value );

	},

	doLog( logItem ) {
		Events.emit( EVT_EVENT, logItem );
	},

	/**
	 * Remove amount of a non-inventory item.
	 * If a tag list is specified, the amount will only be removed
	 * from a single element of the list. Apparently.
	 * @property {string|GData} id - item id or tag.
	 */
	remove( id, amt=1 ){

		let it = typeof id === 'string' ? this.getData(id) : id;

		if ( !it ) {

			it = this.state.getTagList(id);
			it = it ? it.find( v=>!v.disabled&& v.value>=amt ) : null;
			if ( !it ) return;

		}

		if ( it.slot ) {
			if ( this.state.getSlot(it.slot) === it ) this.state.setSlot(it.slot, null);
		}

		if ( it.cost && it.cost.space ) this.getData('space').value += amt*it.cost.space;

		it.value -= amt;
		if ( it.mod ) this.removeMod( it.mod, amt );
		if ( it.lock ) this.unlock( it.lock, amt );

		it.dirty = true;

	},

	/**
	 * Attempt to unlock an item.
	 * @param {GData} it
	 * @returns {boolean} true on success.
	 */
	tryUnlock( it ) {

		if ( it.disabled || it.locks > 0 ) return false;

		let test = it.require || it.need;
		if ( test && !this.unlockTest(test, it ) ) return false;

		it.doUnlock(this);

		return true;

	},

	/**
	 * Called when an item's modifier to other items changes.
	 * The item must be subtracted and re-added to ensure mods are correct.
	 * @param {GData} item
	 */
	modChanged( it ) {

		let val = it.value;
		if ( it.mod ) this.removeMod( it.mod, val );
		if ( it.lock ) this.unlock( it.lock );

	},

	/**
	 * Return the results of a testing object.
	 * @param {string|function|Object|Array} test - test object.
	 * @param {?GData} [item=null] - item being used/unlocked.
	 * @returns {boolean}
	 */
	unlockTest( test, item=null ) {

		//console.log('trying unlock: ' + item.id );
		let type = typeof test;
		if ( type === 'function') return test( this._items, item, this.state );

		else if ( type === 'string') {

			// test that another item is unlocked.
			let it = this.getData(test);
			if ( it === undefined || it === null ) {

				// tag test - if any item with the tag is unlocked, test passes.
				it = this.state.getTagList(test);

				//if ( !it ) console.warn('undefined: ' + test );
				//console.log('testing tag list: ' + test );
				//it.forEach( v=>console.log(v.id));

				return it ? it.some( this.unlockTest, this ) : false;

			}

			// don't need to actually use an action or resource to mark it unlocked.
			return ( it.type === 'resource' || it.type === 'action') ?
				(it.locked === false) : it.value > 0;

		} else if (  Array.isArray(test) ) {

			return test.every( v=>this.unlockTest(v,item), this );

		} else if ( type === 'object' ) {

			/**
			 * @todo: quick patch in case it was a data item.
			 */
			if ( test.id ) return ( test.type === 'resource' || test.type === 'action') ?
			(test.locked === false) : test.value > 0;

			// @todo: take recursive values into account.
			let limit, it;
			for( let p in test ) {

				it = this.getData(p);
				if ( !it ) continue;
				limit = test[p];
				if ( it.value < limit ) return false;

			}
			return true;

		} else if ( test.type != null ) {

			return ( test.type === 'resource' || test.type === 'action') ? !test.locked : test.value > 0;

		} //else console.warn( 'unknown test: ' + test.id || test );

	},

	/**
	 * Perform the one-time effect of an action, resource, or upgrade.
	 * @param {GData} effect
	 * @param {number} dt - time elapsed.
	 */
	applyEffect( effect, dt=1 ) {

		if ( typeof effect === 'object' ) {

			if (  Array.isArray(effect) ) {
				for( let e of effect ) { this.applyEffect( e,dt); }
				return;
			}

			let target, e;
			for( let p in effect ){

				target = this.getData(p);
				e = effect[p];

				if ( target === undefined || target === null ) {

					if ( p === 'title') this.state.player.addTitle( e );
					else if ( p === 'log') Events.emit( EVT_EVENT, e );
					else this.applyToTag( p, e, dt );

				} else {

					if ( typeof e === 'number' || e instanceof Range ) {
						target.amount( this, e*dt );
					} else if ( e === true ) {

						target.doUnlock(this);
						target.onUse( this );

					} else target.applyVars(e,dt);

					target.dirty = true;
				}
			}

		} else if ( typeof effect === 'string') {

			let target = this.getData(effect);
			if ( target !== undefined ) {

				target.amount( this, dt );

			} else {

				this.listGet( this.getTagList(effect), dt );

			}

		}

	},

	/**
	 * Apply an effect or mod to all Items with given tag.
	 * @param {string} tag - item tag.
	 * @param {object} eff - object effect.
	 * @param {number} dt - time or percent of mod to apply.
	 */
	applyToTag( tag, eff, dt ) {

		let target = this.state.getTagList(tag);

		if ( target ) {

			for( let i = target.length-1; i>=0; i--) {
				target[i].applyVars( eff, dt);
				target[i].dirty = true;
			}


		}

	},

	/**
	 *
	 * @param {Object} mod
	 * @param {number} amt
	 */
	removeMod( mod, amt=1 ) {
		this.addMod( mod, -amt);
	},

	/**
	 * Apply a mod.
	 * @param {Array|Object} mod
	 * @param {number} amt - amount added.
	 */
	addMod( mod, amt=1 ) {

		if ( !mod ) return;

		if ( Array.isArray(mod)  ) for( let m of mod ) this.addMod(m, amt);
		else if ( typeof mod === 'object' ) {

			for( let p in mod ) {

				var target = this.getData( p );

				if ( target === undefined ) this.modTag( p, mod[p], amt );
				else if ( mod[p] === true ){

					target.doUnlock(this);

				} else {

					if ( target.applyMods) {
						target.applyMods( mod[p], amt );
						target.dirty = true;
					} else console.warn( 'no applyMods func: ' + target );

				}
			}

		} else if ( typeof mod === 'string') {

			let t = this.getData(mod);
			if ( t ) {

				console.warn('!!!!!!!!!!!!!!ADDING NUMBER MOD: ' + mod );
				t.amount( this, 1 );

			} else {

				let list = this.getTagList(mod);
				if ( list ) list.forEach( this.addMod, this );

			}

		}

	},

	/**
	 * Give a given quantity of item to all elements of an array.
	 * @param {GData[]} a
	 * @param {*} amt
	 */
	listGet( a, amt=1 ) {

		if ( !a ) return;

		for( let i = a.length-1; i>= 0; i-- ) {
			a[i].amount(this, amt);
		}

	},

	/**
	 * Apply an effect or mod to all Items with given tag.
	 * @param {string} tag - item tag.
	 * @param {Object} mods - object mod.
	 * @param {number} dt - time or percent of mod to apply.
	 */
	modTag( tag, mods, dt ) {

		let target = this.state.getTagList(tag);
		if ( target ) {
			for( let i = target.length-1; i>=0; i--) {
				target[i].applyMods( mods, dt);
				target[i].dirty = true;
			}
		}

	},

	/**
	 * Determines whether an item can be run as a continuous action.
	 * @returns {boolean}
	 */
	canRun( it ) {

		if ( !it.canRun ) console.error( it.id + ' missing canRun()');
		else return it.canRun( this, TICK_TIME/1000 );

	},

	/**
	 * Determine if a one-use item can be used. Ongoing/perpetual actions
	 * test with 'canRun' instead.
	 * @param {GData} it
	 */
	canUse( it ){
		if ( !it.canUse ) console.error( it.id + ' missing canUse()');
		else return it.canUse( this );
	},

	/**
	 * Attempts to pay the cost to perform an action, buy an upgrade, etc.
	 * Before calling this function, ensure cost can be met with canPay()
	 *
	 * @param {Array|Object} cost
	 */
	payCost( cost, unit=1) {

		if ( cost === undefined || cost === null ) return;
		if ( Array.isArray(cost)  ) return cost.forEach( v=>this.payCost(v,unit), this );

		let res;
		if ( typeof cost === 'object' ){

			if ( cost instanceof Stat ) {
				var g = this.getData('gold');
				g.value -= cost.value*unit;
				g.dirty = true;
				return;
			}

			for( let p in cost ) {

				res = this.getData(p);
				if ( res ) {

					if ( res.instance || res.isRecipe ) {
						this.payInst( p, cost[p]*unit );
						continue;
					}

					if ( !isNaN(cost[p]) ) this.remove( res, cost[p]*unit );
					else res.applyVars( cost[p], -unit );
					res.dirty = true;

				} else this.payInst(p, cost[p] );

			}

		} else if ( typeof cost === 'boolean') return;
	 	else if ( !isNaN(cost ) ) {

			res = this.getData('gold');
			res.value -= cost*unit;
			res.dirty = true;

		}

	},

	payInst( p, amt ){

		var res = this.state.inventory.find( p,true );
		if ( res ) this.state.inventory.removeQuant(res,amt);
		else console.warn('QUANT NOT FOUND: ' + p );

	},

	/**
	 * Determine if an object cost can be paid before the pay attempt
	 * is actually made.
	 * @todo: this is incorrect for multicosts.
	 * @param {Array|Object} cost
	 * @returns {boolean} true if cost can be paid.
	 */
	canPay( cost, amt=1 ) {

		if (Array.isArray(cost) ) return cost.every( v=>this.canPay(v,amt), this );

		let res;

		if ( typeof cost === 'object' ){

			if ( cost instanceof Stat ) { return this.getData('gold').value >= cost.value*amt; }

			for( let p in cost ) {

				var sub = cost[p];

				res = this.state.getData(p);
				if ( !res ) {
					return false;
				} else if ( res.instance || res.isRecipe ) {

					res = this.state.inventory.findMatch( res );
					if (!res) return false;

				}

				if ( !isNaN(sub) || sub instanceof Stat ) {

					if ( res.value < sub*amt ) return false;

				} else {

					// things like research.max. with suboject costs.
					if ( !this.canPayObj( res, sub, amt ) ) return false;

				}

				// @todo: recursive mod test.
				/*let mod = res.mod;
				if ( mod ) {}*/

			}


		} else if ( typeof cost === 'boolean') return true;
		else if (!isNaN(cost) ) {

			res = this.getData('gold');
			if ( !res) console.error('Error: Gold is missing');
			return res.value >= cost*amt;

		}

		return true;
	},

	/**
	 * Follow object path to determine ability to pay.
	 * @param {object} parent - parent object.
	 * @param {object|number} cost - cost expected on parent or sub.
	 * @param {number} amt - cost multiplier.
	 */
	canPayObj( parent, cost, amt=1 ){

		if ( cost instanceof Stat || !isNaN(cost)){
			return parent.value >= cost;
		}

		for( let p in cost ) {

			var val = cost[p];
			if ( !isNaN(val) || val instanceof Stat ) {
				if ( parent.value < val*amt ) return false;
			} else if ( typeof val === 'object'){

				if ( !this.canPayObj( parent[p], val, amt ) ) return false;
			}

		}

		return true;
	},

	/**
	 * Test if equip is possible. ( Must have space in inventory
	 * for any items replaced. )
	 * @param {*} it
	 */
	canEquip(it) {

		// if inventory contains item, +1 free spaces.
		let adjust = this.state.inventory.includes(it) ? 1 : 0;
		return this.state.equip.replaceCount(it ) <= this.state.inventory.freeSpace() + adjust;

	},

	/**
	 *
	 * @param {*} it
	 * @param {?Inventory} inv - source inventory of item.
	 */
	equip( it, inv=null ) {

		if ( !this.canEquip(it) ) return false;

		console.log('equip:' + it.id  + ' it.type: ' + it.type + ' it.kind: ' + it.kind );
		let res = this.state.equip.equip( it );
		if ( !res) return;

		(inv || this.state.inventory).remove(it);

		if ( typeof res === 'object') {

			if ( Array.isArray(res) ) res.forEach(v=>{

				if ( typeof v !== 'boolean' ) v.unequip( this );

			});
			else { res.unequip( this ); }
			this.state.inventory.add(res);

		}

		it.equip( this );


	},

	unequip( slot, it){

		if ( this.state.inventory.full() ) return false;

		let res = this.state.equip.remove( it, slot );
		if ( res ) {

			this.state.inventory.add(res);

			if (  Array.isArray(res) ) res.forEach(v=>{
				v.unequip(this);
			});
			else {
				res.unequip(this);
			}

		} else console.log('no result');

	},

	/**
	 * Add an item to player's inventory.
	 * @param {*} it
	 */
	take( it ) {
		//console.log('adding: ' + it.id );
		return this.state.inventory.add(it);
	},

	/**
	 * Get loot from an action, monster, or dungeon.
	 * @param {string|Wearable|Object|Array} it
	 * @param {?Inventory} inv - inventory to place looted item.
	 */
	getLoot(it, inv=null) {

		inv = inv || this.state.inventory;

		/** @todo this won't work right */
		if ( typeof it === 'object' && it.stack ) {

			let inst = inv.findMatch( it );
			if ( inst ) {
				inst.value++;
				return;
			}

		}

		let res = this.itemGen.getLoot(it);
		if ( res === null || res === undefined ) return;

		Events.emit( EVT_LOOT, res );

		inv.add( res );

	},

	/**
	 * Decrement lock count on an Item or array of items, etc.
	 * @param {string|string[]|GData|GData[]} id
	 */
	unlock( id ) { this.lock(id, -1); },

	/**
	 * Increment lock counter on item or items.
	 * @param {string|string[]|GData|GData[]} id
	 */
	lock(id, amt=1 ) {

		if (  Array.isArray(id)) {
			id.forEach( v=>this.lock(v, amt ), this );
		} else if ( typeof id === 'object' ) {

			id.locks += amt;
			id.dirty =true;

		} else {

			let it = this.getData(id);
			if ( it ) {
				this.lock(it);

			} else {

				it = this.state.getTagList(id);
				if ( it ) it.forEach( v=>this.lock(v, amt ), this );

			}

		}

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
	 *
	 * @param {string} id
	 * @returns {GData|undefined}
	 */
	getData(id) { return this._items[id] || this.state[id]; },

		/**
	 * Test if a mod can be applied without making value
	 * become negative.
	 * @todo: not implemented.
	 * @param {Array|Object} mod
	 * @param {number} amt
	 */
	/*canMod( mod, amt ) {

		if ( Array.isArray(mod)  ) for( let m of mod ) if ( !this.canMod(m, amt) ) return false;
		else if ( typeof mod === 'object' ) {

			for( let p in mod ) {

				var target = this.getData( p );
				if ( target !== undefined ) return target.canApply( mod[p], amt );

			}

		}

	},*/

}