import DataLoader from './dataLoader';
//import VarPath from './varPath';
import {quickSplice} from './util';
import GData from './items/gdata';
import Log from './log.js';
import GameState from './gameState';
import Range from './range';
import ItemGen from './itemgen';
import TechTree from './techTree';
import Dot from './chars/dot';
import Runnable from './composites/runnable';

/**
 * @module Randoms - randomized events.
 */
import Randoms from './modules/randoms.js';

/**
 * @note these refer to Code-events, not in-game events.
 */
import Events, {EVT_UNLOCK, EVT_EVENT, ACTION_DONE } from './events';
import Resource from './items/resource';
import Skill from './items/skill';
import Stat from './stat';

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

	toJSON() {
		return JSON.stringify( this.state );
	},

	/**
	 * @property {GameState} gameData
	 */
	state:null,

	/**
	 * @property {Object.<string,Item>} items
	 */
	get items() { return this._items; },

	/**
	 * @property {boolean} loaded - true when data is ready and game ready to play.
	 */
	loaded:false,

	/**
	 * @property {Log} log
	 */
	log:new Log(),

	timers:[],

	/**
	 *
	 * @param {*} obj
	 * @param {(number)=>boolean} obj.tick -tick function.
	 */
	addTimer( obj ){
		this.timers.push(obj);
	},

	/**
	 * Clear game data.
	 */
	reset() {

		this.loaded = false;
		this.state = null;
		this._items = null;
		this.timers = [];

		return this.load();

	},

	load( saveData=null ) {

		this.loaded = false;

		// Code events. Not game events.
		Events.init(this);

		return this.loader = DataLoader.loadGame( saveData ).then( allData=>{

			this.state = new GameState( allData, saveData );
			this.itemGen = new ItemGen( this.state );

			this._items = this.state.items;

			this.restoreMods();

			techTree = new TechTree( this._items );
			for( let p in this._items ) {
				if ( !this._items[p].locked ) techTree.changed(p);
			}

			Events.add( ACTION_DONE, this.actionDone, this );


			this.initTimers();

			this.loaded = true;

		}, err=>{ console.error('game err: ' + err )});

	},

	save() {
	},

	/**
	 * Reapply mods for all owned items.
	 */
	restoreMods() {

		let items = this.state.items;

		for( let p in items ) {

			var it = items[p];
			if ( !it.locked && it.value > 0 && !it.disabled ) {
				if ( it.mod ) this.addMod( it.mod, it.value );
			}

		}
		for( let e of this.state.equip ) {
			if ( e.mod ) this.addMod( e.mod, 1 );
		}

	},

	/**
	 * Any item with a timer>0 should be added to timers.
	 */
	initTimers() {

		let acts = this.state.actions;
		for( let i = acts.length-1; i>= 0; i-- ) {
			if ( acts[i].timer > 0) this.addTimer( acts[i]);
		}

	},

	startRaid( dungeon) {

		this.state.raid.setDungeon(dungeon);
		this.setAction( this.state.raid );

	},

	pause() {
	},

	unpause() {
	},

	/**
	 * Frame update.
	 */
	update() {

		//console.log('tests: ' + unlockTests );
		//unlockTests = 0;

		let time = Date.now();
		let dt = ( time - this.lastUpdate )/1000;
		this.lastUpdate = time;

		this.state.player.update(dt);
		this.state.minions.update(dt);

		this.doCurrent( dt );

		this.doResources(dt, this.state.resources);
		this.doResources( dt, this.state.playerStats );

		if ( this.timers ) {

			for( let i = this.timers.length-1; i>= 0; i-- ) {
				if ( this.timers[i].tick(dt) ) quickSplice( this.timers, i );
			}

		}

		for( let p in this._items ) {

			var it = this._items[p];
			if ( it.dirty === true ) {

				it.dirty = false;
				techTree.changed(p);
			}

		}

	},

	/**
	 * Frame update of all resources.
	 * @param {number} dt - elapsed time.
	 */
	doResources( dt, stats ) {

		let len = stats.length, stat;
		for( let i = len-1; i >= 0; i-- ) {

			stat = stats[i];
			if ( stat.locked === false ) {

				if  ( stat.rate.value !== 0 ) { this.doItem( stat, stat.rate.value*dt );
				}

			}

		}

	},

	/**
	 * Performs tick update of the current action/skill.
	 * @param {number} dt - elapsed time
	 */
	doCurrent( dt ) {

		let action = this.state.curAction;
		if ( !action ) return;

		if ( !action.canUse() ) {
			console.log('ACTION MAXED: ' + action.id );
			this.setAction(null);
			return;
		}

		if ( action.run ) {

			if ( !this.canPay( action.run, dt ) ) {
				//console.log('CANT PAY: ' + action.id );
				this.doRest( true )
				return;
			}
			this.payCost( action.run, dt );

		}

		if ( action.fill && this.filled(action.fill ) ) {
			this.haltAction();
		} else if ( action.update ) {

			action.update(dt);
			action.dirty = true;

		} else {

			if ( action.effect) this.applyEffect( action.effect, dt );
			if ( action.length ) action.exp += dt;
			action.dirty = true;

		}

	},

	actionDone( act ) {

		if ( this.state.curAction === act ) {
			if ( this.canPay( act.cost ) ) this.setAction( act );
			else this.setAction(null);
		}

	},

	/**
	 * Toggles an action on or off.
	 * @param {GData} act
	 * @returns {boolean} - true if action is now current, false otherwise.
	 */
	toggleAction(act) {

		if ( this.state.curAction === act ) {
			this.state.curAction = null;
		} else this.setAction(act);

		this.state.resumeAction = null;
		return this.state.curAction !== null;

	},

	/**
	 *
	 * @param {boolean} [resume=false] - resume current action afterwards?
	 */
	doRest( resume=false ) {

		this.state.resumeAction = resume===true ? this.state.curAction : null;
		this.state.curAction = this.state.restAction;

	},

	setAction( act ) {

		/**
		 * Cost to begin action.
		 */
		if ( act && act.cost && (act.exp === 0) ) {
			this.payCost( act.cost);

		}

		this.state.resumeAction = null;
		this.state.curAction = act;

		return true;

	},

	/**
	 * Halts action when requirements are no longer met.
	 * If the action was a rest action, any previous action is resumed.
	 */
	haltAction() {

		let cur = this.state.curAction;

		// was resting.
		if ( cur === this.state.restAction ) {

			this.state.curAction = this.state.resumeAction || null;
			this.state.resumeAction = null;

		} else {

			this.state.resumeAction = null;
			this.state.curAction = this.state.restAction;

		}

	},

	/**
	 * Tests if a named resource has been filled to max.
	 * @param {Item|Item[]} v
	 */
	filled( v ) {

		if ( Array.isArray(v) ) {
			for( let i = v.length-1; i>=0; i-- ) {
				if ( !this.filled( v[i] ) )return false;
			}
			return true;
		}

		let fill = this.getData(v);
		if (fill === undefined ) {

			fill = this.state.getTagList( v );
			return fill === undefined ? true : this.filled(fill);

		}
		//console.log( 'fill ' + fill.id + ' ? ' + fill.value + ' / ' + fill.max.value );
		return fill.maxed();

	},

	/**
	 * Completely disable an item - cannot be purchased/used/etc.
	 * @param {string|GData|Array} it
	 */
	disable( it ) {

		if ( Array.isArray(it) ) for( let v of it ) this.disable(v);
		else {

			if ( typeof it === 'string' ) {

				let item = this.getData( it );
				if ( !item ) {

					let list = this.state.getTagList(it);
					if ( list ) for( let v of list ) this.disable(v);
					return;

				} else it = item;

			}

			if ( it ) {

				it.disabled = true;

				console.log( 'DISABLE: ' + it.id );

				if ( it.slot && this.state.getSlot(it.slot, it.type) === it ) {
					this.state.setSlot(it.slot, null );
				}

				if ( it == this.state.curAction ) this.doRest();
				if ( it == this.state.raid.dungeon ) this.state.raid.setDungeon(null);

				if ( it instanceof Resource || it instanceof Skill ) {
					this.remove( it, it.value);

				} else if ( it.mod ) this.removeMod( it.mod, it.value );

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
	 * @returns {boolean}
	 */
	trySell( it, inv ) {

		if ( it.value < 1 ) return false;

		let sellObj = it.sell || it.cost;
		let goldPrice = this.sellPrice(it);

		if ( sellObj && typeof sellObj === 'object' ) {
			if ( sellObj.space ) this.getData('space').value += sellObj.space;
		}
		this.getData('gold').value += goldPrice;

		if ( it.slot && this.state.getSlot(it.slot) === it ) this.state.setSlot(it.slot,null);
		it.value -= 1;

		if ( it.instance ) {

			if ( inv ) inv.remove( it );
		} else {

			if ( it.mod ) this.removeMod( it.mod, 1 );

		}

		return true;

	},

	/**
	 * Remove all quantity of an item.
	 * @param {string|string[]|GData|GData[]} it
	 */
	removeAll( it ){

		if ( it instanceof Object ) {

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
	 * @returns {boolean}
	 */
	tryBuy(it) {

		if ( this.canPay(it.buy) === false ) return false;
		this.payCost( it.buy );

		if ( it.isProto ) this.create( it );

		it.owned = true;

	},

	/**
	 * Attempt to pay for an item, and if the cost is met, apply it.
	 * @param {GData} it
	 * @returns {boolean} - true if item is used. note that 'buying' an item
	 * does not actually use it, and returns false.
	 */
	tryItem(it) {

		if ( !this.canUse(it) ) return false;

		if ( it.buy && !it.owned ) {

			this.payCost( it.buy );
			it.owned = true;
			return false;

		} else {

			if ( it.isProto ) {

				this.craft(it );

			} else if ( it.perpetual || it.length > 0 ) {

				this.setAction(it);

			} else {

				if ( it.slot && this.state.getSlot( it.slot, it.type) === it ) return;

				this.payCost( it.cost );
				return this.doItem(it);
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
	 * Create an item whose cost has been met ( or been provided by an effect )
	 * @param {*} it
	 */
	create( it) {

		/**
		 * create monster and add to inventory.
		 * @todo this is hacky.
		*/
		if ( it.type === 'monster' ) {

			this.state.minions.add( this.itemGen.npc(it) );

		} else {

			let inst = it.stack ? this.state.inventory.find( it.id, true ) : null;
			if ( inst ) {

				console.log('stack exists: ' + inst.value);
				inst.value++;

			} else {

				inst = this.itemGen.instance( it );
				if ( inst ) inst.value = 1;
				this.state.inventory.add( inst );

			}

		}


	},

	/**
	 * Use item from inventory.
	 * @param {*} it
	 */
	use( it, targ, inv=null ) {

		if ( it.consume === true ) {
			it.value--;
			if ( it.value <= 0 ) ( inv || this.state.inventory ).remove(it);
		}
		if ( it.use ) {
			if ( it.use.dot ) this.state.player.addDot( new Dot( it.use.dot, it.id, it.name) );
			this.applyEffect( it.use );
		}

	},

	/**
	 *
	 * @param {GData} it
	 * @param {GData} targ - enchant target.
	 */
	tryUseWith( it, targ ) {

		if ( targ === null || targ === undefined ) return;

		if ( it.buy && !it.owned ) {

			this.payCost( it.buy );
			it.owned = true;

		} else {

			this.payCost( it.cost );

			if ( !it.length ) this.useWith( it, targ );
			else {

				let act = new Runnable( {item:it,target:targ});
				this.setAction( act );

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
	useWith( it, targ ) {

		if ( targ === null || targ === undefined ) return;

		if ( typeof it.usingWith === 'function') it.usingWith( targ );
		it.value++;

		console.log('USING: ' + it.id  + ' with ' + targ.id );

		if ( it.mod ) targ.applyMods( it.mod, 1 );
		if ( it.effect ) targ.applyVars( it.effect, 1 );

	},


	fillItem( id ) {

		let it = this.getData(id);
		if ( !it || !it.max ) return;

		let del = it.max.value - it.value;
		if ( del > 0) this.doItem( it, it.max.value - it.value );

	},

	/**
	 * Get a game item without paying cost.
	 * @param {GData} it
	 * @param {number} count
	 */
	doItem( it, count=1 ) {

		if ( it.maxed() ) return false;
		if ( it.isProto ) {
			console.log('CREATING PROTO');
			return this.create(it);
		}

		if ( it.slot) {

			let cur = this.state.getSlot(it.slot, it.type );
			console.log('cur slot: ' + (cur ? cur.id : 'none'));
			if ( cur ) {
				this.remove( cur, 1 );
			}
			this.state.setSlot(it.slot, it);

		}
		if ( it.exec ) it.exec();

		it.value += it.consume ? -count : count;

		if ( it.title ) this.state.player.title = it.title;
		if ( it.effect ) this.applyEffect(it.effect);
		if ( it.mod ) this.addMod( it.mod, count );
		if ( it.lock ) this.lock( it.lock );
		if ( it.dot ) this.state.player.addDot( new Dot(it.dot, it.id, it.name) );
		if ( it.disable ) this.disable( it.disable );

		if ( it.log ) Events.dispatch( EVT_EVENT, it.log );

		if ( it.attack ) {
			if ( (it.type !== 'wearable' && it.type !== 'weapon') && this.state.curAction === this.state.raid )
				this.state.raid.spellAttack( it );
		}

		it.dirty = true;
		return true;

	},

	/**
	 *
	 * @param {Object} evt
	 */
	unlockEvent( evt ) {

		// randomized event.
		if ( evt.rand ) {

		} else this.doEvent(evt);

	},

	/**
	 * Trigger an event. (Randomized events are also triggered.)
	 * @param {*} evt
	 */
	doEvent(evt){
		if ( !this.doItem(evt) ) return false;
		evt.locked = false;
		Events.dispatch( EVT_EVENT, evt );
	},

	doLog( logItem ) {
		Events.dispatch( EVT_EVENT, logItem );
	},

	/**
	 * Remove some amount of an item.
	 * @property {string} id - item id or tag.
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
		if ( it.lock ) this.unlock( it.lock );

		it.dirty = true;

	},

	/**
	 * Attempt to unlock an item.
	 * @param {GData} it
	 * @returns {boolean} true on success.
	 */
	tryUnlock( it ) {

		//unlockTests++;

		if ( it.disabled || (it.need && !this.unlockTest(it.need,it)) ) return false;

		else if ( !it.require || this.unlockTest(it.require,it) ) {

			if ( it.type === 'event') this.unlockEvent( it );
			else {
				it.locked = false;
				it.dirty = true;
				Events.dispatch( EVT_UNLOCK, it );
			}

			return true;
		}

		return !it.locked;

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

		} else if (  Array.isArray(test) ) return test.every( v=>this.unlockTest(v,item), this );
		else if ( test.type != null ) {

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
					else this.applyToTag( p, e, dt );
				} else {
					if ( target.type === 'event' ) this.unlockEvent( target );
					else if ( typeof e === 'number' ) this.doItem( target, e*dt );
					else if ( e instanceof Range ) this.doItem( target, e.value );
					else if ( typeof e === 'boolean') {

						target.locked = !e;
						this.doItem( target );

					} else target.applyVars(e,dt);

					target.dirty = true;
				}
			}

		} else if ( typeof effect === 'string') {

			let target = this.getData(effect);
			if ( target !== undefined ) {

				if ( target.type === 'event') this.unlockEvent( target );
				else this.doItem( target, dt );

			}

		}

	},

	/**
	 * Test if a mod can be applied without making value
	 * become negative.
	 * @param {Array|Object} mod
	 * @param {number} amt
	 */
	canMod( mod, amt ) {

		if ( Array.isArray(mod)  ) for( let m of mod ) if ( !this.canMod(m, amt) ) return false;
		else if ( typeof mod === 'object' ) {

			for( let p in mod ) {

				var target = this.getData( p );
				if ( target !== undefined ) return target.canApply( mod[p], amt );

			}

		}

	},

	/**
	 * Apply a mod.
	 * @param {Array|Object} mod
	 * @param {number} amt - amount added.
	 */
	addMod( mod, amt=1 ) {

		if ( Array.isArray(mod)  ) for( let m of mod ) this.addMod(m, amt);
		else if ( typeof mod === 'object' ) {

			for( let p in mod ) {

				var target = this.getData( p );

				if ( target === undefined ) this.modTag( p, mod[p], amt );
				else if ( mod[p] === true ) this.doItem( target, 1 );
				else {
					target.applyMods( mod[p], amt );
					target.dirty = true;
				}
			}

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
	 * Apply an effect or mod to all Items with given tag.
	 * @param {string} tag - item tag.
	 * @param {Object} obj - object mod.
	 * @param {number} dt - time or percent of mod to apply.
	 */
	applyToTag( tag, obj, dt ) {

		let target = this.state.getTagList(tag);
		if ( target ) {
			for( let i = target.length-1; i>=0; i--) {
				target[i].applyVars( obj, dt);
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
	 *
	 * @param {*} it
	 */
	canBuy(it) {

		if ( it.disabled || it.locked || it.locks > 0 ) return false;

		if ( it.buy && !this.canPay(it.buy) ) return false;

		return !it.maxed();

	},

	/**
	 * Determines whether an item can be run as a continuous action.
	 * @returns {boolean}
	 */
	canRun( it ) {

		if ( it.disabled || it.maxed() || (it.need && !this.unlockTest( it.need, it )) ) return false;

		if ( it.buy && !it.owned && !this.canPay(it.buy) ) return false;

		// cost only paid at _start_ of runnable action.
		if ( it.cost && (it.exp === 0) && !this.canPay(it.cost) ) return false;

		if ( it.fill ) {

			let t = this.getData(it.fill);
			if ( t && t.maxed() ) return false;

		}
		return !it.run || this.canPay( it.run, TICK_TIME/1000 );

	},

	/**
	 * Determine if a one-use item can be used. Ongoing/perpetual actions
	 * test with 'canRun' instead.
	 * @param {GData} it
	 */
	canUse( it ){

		if ( it.disabled || (it.need && !this.unlockTest( it.need, it )) ) return false;

		if ( it.buy && !it.owned && !this.canPay(it.buy) ) return false;
		if ( it.slot && this.state.getSlot(it.slot, it.type ) === it) return false;
		if ( it.maxed() ) return false;

		if ( it.cd && it.timer > 0 ) return false;

		if ( it.fill ) {

			let t = this.getData(it.fill);
			if ( t && t.maxed() ) return false;

		}

		return !it.cost || this.canPay(it.cost);
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
			}

			for( let p in cost ) {

				res = this.getData(p);
				if ( res ) {

					if ( !isNaN(cost[p]) ) this.remove( res, cost[p]*unit );
					else res.applyVars( cost[p], -unit );
					res.dirty = true;

				}

			}

		} else if ( typeof cost === 'boolean') return;
	 	else if ( !isNaN(cost ) ) {

			res = this.getData('gold');
			res.value -= cost*unit;
			res.dirty = true;

		}

	},

	/**
	 * Determine if an object cost can be paid before the pay attempt
	 * is actually made.
	 * @param {Array|Object} cost
	 * @returns {boolean} true if cost can be paid.
	 */
	canPay( cost, unit=1 ) {

		if (Array.isArray(cost) ) return cost.every( v=>this.canPay(v,unit), this );

		let res;

		if ( typeof cost === 'object' ){

			if ( cost instanceof Stat ) { return this.getData('gold').value >= cost.value*unit; }

			for( let p in cost ) {

				res = this.getData(p);
				if ( res === undefined || res.value < cost[p]*unit ) return false;

				// @todo: recursive mod test.
				/*let mod = res.mod;
				if ( mod ) {

				}*/

			}


		} else if ( typeof cost === 'boolean') return true;
		else if (!isNaN(cost) ) {

			res = this.getData('gold');
			if ( !res) console.error('Error: Gold is missing');
			return res.value >= cost*unit;

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

		console.log('erquip weap:' + it.id  + ' it.type: ' + it.type + ' it.kind: ' + it.kind );
		let res = this.state.equip.equip( it );
		if ( !res) return;

		(inv || this.state.inventory).remove(it);

		if ( typeof res === 'object') {

			if ( Array.isArray(res) ) res.forEach(v=>{

					if ( typeof v === 'boolean') return;
					v.unequip(this.state.player);
					if ( v.mod ) this.removeMod( v.mod );

				});
			else {
				res.unequip( this.state.player );
				if ( res.mod ) this.removeMod( res.mod );
			}
			this.state.inventory.add(res);

		}
		if ( it.mod) this.addMod(it.mod);
		//this.doItem(it);
		it.equip( this.state.player );


	},

	unequip( slot, it){

		if ( this.state.inventory.full() ) return false;

		let res = this.state.equip.remove( it, slot );
		if ( res ) {

			console.log('to inv-> ' + res.id );
			this.state.inventory.add(res);

			if (  Array.isArray(res) ) res.forEach(v=>{
				v.unequip(this.state.player);
				if ( v.mod ) this.removeMod( v.mod );
				//this.remove(v);
			});
			else {
				res.unequip(this.state.player);
				if ( res.mod ) this.removeMod( res.mod );
				//this.remove(res);
			}

		} else console.log('no reuslt');

	},

	/**
	 * Remove an item from inventory.
	 * @param {*} it
	 */
	drop(it) {
		this.state.inventory.remove(it);
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

		if ( typeof it === 'object' && it.stack ) {

			let inst = inv.find( it.id, true );
			if ( inst ) {
				inst.value++;
				return;
			}

		}

		let res = this.itemGen.getLoot(it);
		if ( res === null || res === undefined ) return;
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
	lock(id, amt=1) {

		if (  Array.isArray(id)) {
			id.forEach( v=>this.lock(v,amt), this );
		} else if ( typeof id === 'object' ) {

			id.locks += amt;
			id.dirty =true;

		} else {

			let it = this.getData(id);
			if ( it ) {

				it.locks += amt;
				console.log( it.id + ' adding locks: ' + it.locks );
				it.dirty = true;

			} else {

				it = this.state.getTagList(id);
				if ( it ) it.forEach(v=>this.lock(v,amt), this );

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

}