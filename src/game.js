import DataLoader from './dataLoader';
import VarPath from './varPath';
import Percent from './percent';
import Item from './items/item';
import Log from './log.js';
import GameState from './gameState';
import Range from './range';
import ItemGen from './itemgen';
import TechTree from './techTree';
import Dot from './chars/dot';

var lastTime = 0;
var techTree;

/**
 * @constant {number} TICK_TIME - time in milliseconds between updates.
 */
export const TICK_TIME = 200;

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

	/**
	 * Clear game data.
	 */
	reset() {

		this.loaded = false;
		this.state = null;
		this._items = null;

		return this.load();

	},

	load( saveData=null ) {

		this.loaded = false;

		return this.loader = DataLoader.loadGame( saveData ).then( allData=>{

			this.state = new GameState( allData, saveData );
			this.itemGen = new ItemGen( this.state );

			this._items = this.state.items;

			techTree = new TechTree( this._items );

			this.initEvents();

			this.loaded = true;

		}, err=>{ console.error('game err: ' + err )});

	},

	save() {
	},

	initEvents() {

		let evts = this.state.events;
		for( let i = evts.length-1; i>= 0; i-- ) {

			var e = evts[i];
			if ( !e.locked ) this.doEvent(e);

		}

	},

	startRaid( dungeon) {

		this.state.raid.setDungeon(dungeon);
		this.setAction( this.state.raid );

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

		this.doCurrent( dt );

		this.doResources(dt);

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
	doResources( dt ) {

		let stats = this.state.resources;
		let len = stats.length, stat;
		for( let i = len-1; i >= 0; i-- ) {

			stat = stats[i];
			if ( stat.locked === false && stat.rate.value !== 0 ) {

				this.doItem( stat, stat.rate.value*dt );

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

		if ( action.maxed() ) {
			this.setAction(null);
			return;
		}

		if ( action.run ) {

			if ( !this.canPay( action.run, dt ) ) {
				//console.log('halting action: ' + action.id );
				this.haltAction()
				return;
			}
			this.payCost( action.run, dt );

		}

		if ( action.fill && this.filled(action.fill ) ) this.haltAction();
		else if ( action.update ) {

			action.update(dt);
			action.dirty = true;

		} else {

			if ( action.length ) action.progress += dt;
			action.dirty = true;
			// ongoing effect.
			if ( action.effect) this.applyEffect( action.effect, dt );

		}

	},

	/**
	 * Toggles an action on or off.
	 * @param {Item} act
	 * @returns {boolean} - true if action is now current, false otherwise. 
	 */
	toggleAction(act) {

		if ( this.state.curAction === act ) {
			this.state.curAction = null;
		} else this.setAction(act);

		this.state.resumeAction = null;
		return this.state.curAction !== null;

	},

	doRest( resume=false ) {

		this.state.resumeAction = resume===true ? this.state.curAction : null;
		this.state.curAction = this.state.restAction;

	},

	setAction( act ) {

		/**
		 * Cost to begin action.
		 */
		if ( act && act.cost && (act.progress === 0) ) {

			//console.log('PAY ACTION: ' + act.progress );
			//if ( !this.canPay(act.cost) ) return false;
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

			this.state.resumeAction = cur;
			this.state.curAction = this.state.restAction;

		}

	},

	/**
	 * Tests if a named resource has been filled to max.
	 * @param {Resource|Resource[]} v 
	 */
	filled( v ) {

		if ( Array.isArray(v) ) {
			for( let i = v.length-1; i>=0; i-- ) {
				if ( !this.filled( v[i] ) )return false;
			}
			return true;
		}

		let fill = v instanceof VarPath ? this.getPathItem( v ) : this.getItem(v);
		//console.log( 'fill ' + fill.id + ' ? ' + fill.value + ' / ' + fill.max.value );
		return fill.locked || fill.value >= fill.max.value;

	},

	/**
	 * 
	 * @param {Object} evt 
	 */
	doEvent( evt ) {

		if ( evt.maxed() ) return;
		if ( evt.disable ) this.disable( evt.disable);

		if ( evt.title ) this.state.player.title = evt.title;

		if ( evt.effect ){
			this.applyEffect( evt.effect, 1 );
		}

		evt.locked = false;
		evt.value = 1;

		//console.log('event done: ' + evt.id );
		this.log.log( evt.name, evt.desc, 'event' );

		evt.dirty = true;

	},

	/**
	 * Completely disable an item - cannot be purchased/used/etc.
	 * @param {string|Item|Array} it 
	 */
	disable( it ) {

		if ( Array.isArray(it) ) for( let v of it ) this.disable(v);
		else {

			if ( typeof it === 'string' ) it = this.getItem( it );
			if ( it ) {

				it.disabled = true;

				if ( it.slot && this.state.getSlot(it.slot) === it ) {
					this.state.setSlot(it.slot, null );
				}

				if ( it == this.state.curAction ) this.state.curAction = null;
				if ( it == this.state.raid.dungeon ) this.state.raid.setDungeon(null);
	
				// remove all stat mods.
				if ( it.mod ) this.removeMod( it.mod, it.value );

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

			this.getItem('gold').value += costObj*this.state.sellRate;

		} else if ( costObj instanceof Object ) {

			if ( costObj.gold ) this.getItem('gold').value += costObj.gold*this.state.sellRate;
			if ( costObj.space ) this.getItem('space').value += costObj.space;

		}

		it.value -= 1;
		if ( it.mod ) this.removeMod( it.mod, 1 );

		return true;

	},

	/**
	 * Remove all quantity of an item.
	 * @param {string|string[]|Item|Item[]} it
	 */
	removeAll( it ){

		if ( it instanceof Object ) {

			this.remove( it, it.value );

		} else if ( Array.isArray(it)) {
			it.forEach( this.removeAll, this );

		} else {

			let item = this.getItem( it );
			if ( item ) this.remove( it, it.value );
			else {

				item = this.state.getTagList( it );
				if ( item ) item.forEach( this.removeAll, this );

			}

		}

	},

	/**
	 * Attempt to pay the cost to permanently buy an item.
	 * @param {Item} it 
	 * @returns {boolean}
	 */
	tryBuy(it) {

		if ( !this.canPay(it.buy) ) return false;
		this.payCost( it.buy );

		it.owned = true;

	},

	/**
	 * Attempt to pay for an item, and if the cost is met, apply it.
	 * @param {Item} it
	 * @returns {boolean}
	 */
	tryItem(it) {

		if ( !this.canUse(it) ) return false;

		if ( it.buy && !it.owned ) {
			console.log('buying');
			this.payCost( it.buy );
			it.owned = true;
		}


		this.payCost( it.cost );

		return this.doItem(it);
	},

	/**
	 * Get a game item without paying cost.
	 * @param {Item} it 
	 * @param {number} count 
	 */
	doItem(it, count=1) {

		it.value += count;

		if ( it.slot ) {

			let cur = this.state.getSlot(it.slot);
			if ( cur ) { this.remove( cur, 1 ); }
			this.state.setSlot(it.slot, it);

		}

		if ( it.effect ) this.applyEffect(it.effect);
		if ( it.mod ) this.addMod( it.mod, 1 );
		if ( it.lock ) this.lock( it.lock );
		if ( it.dot ) this.state.player.addDot( new Dot(it.dot, it.id, it.name) );
		if ( it.disable ) this.disable( it.disable );

		if ( it.log ){
			this.log.log( it.log.title, it.log.text );
		}

		if ( it.attack ) {
			if ( it.type !== 'wearable' && this.state.curAction === this.state.raid )
				this.state.raid.spellAttack( it );
		}

		it.dirty = true;
		return true;

	},

	/**
	 * Remove some amount of an item.
	 * @property {string} id - item id or tag.
	 */
	remove( id, amt=1 ){

		let it = typeof id === 'string' ? this.getItem(id) : id;
		if ( !it ) {

			it = this.state.getTagList(id);
			it = it ? it.find( v=>!v.disabled&& v.value>=amt ) : null;
			if ( !it ) return;

		}

		if ( it.slot ) {
			if ( this.state.getSlot(it.id) === it ) this.state.setSlot(it.id, null);
		}

		if ( it.cost && it.cost.space ) this.getItem('space').value += amt*it.cost.space;

		it.value -= amt;
		if ( it.mod ) this.removeMod( it.mod, amt );
		if ( it.lock ) this.unlock( it.lock );

		it.dirty = true;

	},

	/**
	 * Attempt to unlock an item.
	 * @param {Item} it
	 * @returns {boolean} true on success. 
	 */
	tryUnlock( it ) {

		//unlockTests++;

		if ( it.disabled || (it.need && !this.unlockTest(it.need,it)) ) return false;

		else if ( !it.require || this.unlockTest(it.require,it) ) {

			this.log.log( 'Unlocked: ' + it.name, it.name + ' has been unlocked.', 'unlock' );
			it.locked = false;
			if ( it.type === 'event') this.doEvent( it );
			else it.dirty = true;

			return true;
		}

		return !it.locked;

	},

	/**
	 * Called when an item's modifier to other items changes.
	 * The item must be subtracted and re-added to ensure mods are correct.
	 * @param {Item} item 
	 */
	modChanged( it ) {

		let val = it.value;
		if ( it.mod ) this.removeMod( it.mod, val );
		if ( it.lock ) this.unlock( it.lock );

	},

	/**
	 * Return the results of a testing object.
	 * @param {string|function|Object|Array} test - test object.
	 * @param {?Item} [item=null] - item being used/unlocked.
	 * @returns {boolean}
	 */
	unlockTest( test, item=null ) {

		let type = typeof test;
		if ( type === 'function') return test( this._items, item );

		else if ( type === 'string') {

			// test that another item is unlocked.
			let it = this.getItem(test);
			if ( it === undefined ) {

				// tag test - if any item with the tag is unlocked, test passes.
				it = this.state.getTagList(test);
				
				//if ( !it ) console.warn('undefined: ' + test );
				console.log('testting tag list: ' + test );
				it.forEach( v=>console.log(v.id));
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
	 * @param {Item} effect
	 * @param {number} dt - time elapsed.
	 */
	applyEffect( effect, dt=1 ) {

		if ( typeof effect === 'object' ) {

			if (  Array.isArray(effect) ) {
				for( let e of effect ) {
					this.applyEffect( e,dt);
				}
				return;
			}

			let target, e;
			for( let p in effect ){

				target = this.getItem(p);
				e = effect[p];

				if ( target === undefined ) {
					this.applyToTag( p, e, dt );
				} else {
					if ( target.type === 'event' ) this.doEvent( target );
					else if ( typeof e === 'number' ) this.doItem( target, e*dt );
					else if ( e instanceof Range ) this.doItem( target, e.value );
					else if ( typeof e === 'boolean') this.doItem( target );
					else target.applyVars(e,dt);
				
					target.dirty = true;
				}
			}

		} else if ( typeof effect === 'string') {

			let target = this.getItem(effect);
			if ( target !== undefined ) {

				if ( target.type === 'event') this.doEvent( target );
				else this.doItem( target, dt );

			}

		}

	},

	/**
	 * Apply a mod.
	 * @param {Array|Object} mod
	 * @param {number} amt - amount added.
	 */
	addMod( mod, amt ) {

		if ( Array.isArray(mod)  ) for( let m of mod ) this.addMod(m, amt);
		else if ( typeof mod === 'object' ) {
	
			for( let p in mod ) {

				var target = this.getItem( p );

				if ( target === undefined ) this.applyToTag( p, mod[p], amt );
				else {
					target.applyVars( mod[p], amt );
					target.dirty = true;
				}
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
	removeMod( mod, amt ) {
		this.addMod( mod, -amt);
	},

	/**
	 * 
	 * @param {*} it 
	 */
	canBuy(it) {

		if ( it.owned || it.disabled || it.locked || it.maxed() || it.locks > 0 ) return false;
		if ( it.buy && !this.canPay(it.buy) ) return false;

		return true;

	},

	/**
	 * Determines whether an item can be run as a continuous action.
	 * @returns {boolean}
	 */
	canRun( it ) {

		if ( it.disabled || it.maxed() || (it.need && !this.unlockTest( it.need, it )) ) return false;
	
		if ( it.buy && !it.owned && !this.canPay(it.buy) ) return false;

		// cost only paid at _start_ of runnable action.
		if ( it.cost && (it.progress === 0) && !this.canPay(it.cost) ) return false;

		if ( it.fill ) {

			let t = this.getItem(it.fill);
			if ( t && t.maxed() ) return false;

		}
		return !it.run || this.canPay( it.run, TICK_TIME/1000 );

	},

	/**
	 * Determine if a one-use item can be used. Ongoing/perpetual actions
	 * test with 'canRun' instead.
	 * @param {*} it 
	 */
	canUse( it ){

		if ( it.disabled || (it.need && !this.unlockTest( it.need, it )) ) return false;

		if ( it.buy && !it.owned && !this.canPay(it.buy) ) return false;

		if ( it.fill ) {

			let t = this.getItem(it.fill);
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

			for( let p in cost ) {

				res = this.getItem(p);
				if ( res ) {

					if ( !isNaN(cost[p]) ) res.value -= cost[p]*unit;
					else res.applyVars( cost[p], -unit );
					res.dirty = true;

				}

			}

		} else if ( !isNaN(cost ) ) {

			res = this.getItem('gold');
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

			for( let p in cost ) {

				res = this.getItem(p);
				if ( res === undefined || res.value < cost[p]*unit ) return false;

			}


		} else if (!isNaN(cost) ) {

			res = this.getItem('gold');
			if ( !res) console.error('Error: Gold is missing');
			return res.value >= cost*unit;

		}

		return true;
	},

	equip( it, slot=null ) {

		//console.log('equip: ' + it.id );
		let res = this.state.equip.equip( it, slot );
		if ( !res) return;

		this.state.inventory.remove( it );
		if ( typeof res === 'object') {

			if ( Array.isArray(res) ) res.forEach(v=>{

					if ( typeof v === 'boolean') return;
					v.unequip(this.state.player);
					this.remove(v);
	
				});
			else {
				res.unequip( this.state.player );
				this.remove( res );
			}
			this.state.inventory.add(res);

		}
	
		this.doItem(it);
		it.equip( this.state.player );


	},

	unequip( slot, it){

		let res = this.state.equip.remove( it, slot );
		if ( res ) {

			console.log('to inv-> ' + res.id );
			this.state.inventory.add(res);

			if (  Array.isArray(res) ) res.forEach(v=>{
				v.unequip(this.state.player);
				this.remove(v);
			});
			else res.unequip(this.state.player);

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
	 * Get loot from an action, monster, or dungeon.
	 * @param {string|Wearable|Object|Array} it 
	 */
	getLoot(it) {

		let res = this.itemGen.getLoot(it);
		if ( res !== null && res !== undefined ) this.state.inventory.add( res );

	},

	/**
	 * Decrement lock count on an Item or array of items, etc.
	 * @param {string|string[]|Item|Item[]} id 
	 */
	unlock( id ) {
		this.lock(id, -1);
	},

	/**
	 * Increment lock counter on item or items.
	 * @param {string|string[]|Item|Item[]} id 
	 */
	lock(id, amt=1) {

		if (  Array.isArray(id)) {
			id.forEach( v=>this.lock(v,amt), this );
		} else if ( typeof id === 'object' ) {

			id.locks += amt;
			id.dirty =true;

		} else {

			let it = this.getItem(id);
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