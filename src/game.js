import DataLoader from './dataLoader';
import VarPath from './varPath';
import Percent from './percent';
import Item from './items/item';
import Log from 'log.js';
import GameState from './gameState';
import Range from './range';
import ItemGen from './itemgen';

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

		return this.loader = DataLoader.loadData( saveData ).then( allData=>{

			this.state = new GameState( allData, saveData );

			this.itemGen = new ItemGen( this.state );

			this._items = this.state.items;
			this.initEvents();

			this.loaded = true;

		}, err=>{ console.error('game err: ' + err )});

	},

	save() {
	},

	initEvents() {

		/// events to watch for unlocking.
		this.watchEvents = [];

		let evts = this.state.events;
		for( let i = evts.length-1; i>= 0; i-- ) {

			var e = evts[i];
			if ( !e.locked ) this.doEvent(e);
			else if ( !e.disabled && (e.require||e.need) ) {
				this.watchEvents.push(e);
			}

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

		let time = Date.now();
		let dt = ( time - this.lastUpdate )/1000;
		this.lastUpdate = time;

		this.doDots(dt);

		this.doCurrent( dt );

		this.doResources(dt);

		/**
		 * @todo - inefficient.
		 */
		this.checkEvents();

	},

	checkEvents(){

		let a = this.watchEvents;
		for( let i = a.length-1; i>=0; i-- ) {

			var e = a[i];
			if ( e.locked && !e.disabled ) {

				if ( this.tryUnlock(e) ) {
					this.doEvent(e);			
				} else continue;

			}
			a[i] = a[a.length-1];
			a.pop();


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

		let updates = this.state.player.dots;
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
	doCurrent( dt ) {

		let action = this.state.curAction;
		if ( !action ) return;

		if ( action.maxed() ) {
			this.setAction(null);
			return;
		}

		if ( action.cost ) {

			if ( !this.canPay( action.cost, dt ) ) {
				//console.log('halting action: ' + action.id );
				this.haltAction()
				return;
			}
			this.payCost( action.cost, dt );

		}

		if ( action.update ) {
			action.update(dt);

		} else if ( action.length ) {

			action.progress += dt;
			/// any action effect functions as a dot.
			if ( action.effect) this.applyEffect( action.effect, dt );

		} else {

			if ( action.effect ) this.applyEffect( action.effect, dt );
			if ( action.fill && this.filled(action.fill ) ) this.haltAction();

		}

	},

	/**
	 * Toggles an action on or off.
	 * @param {Item} act
	 * @returns {boolean} - true if action is now current, false otherwise. 
	 */
	toggleAction(act) {

		this.state.curAction = this.state.curAction === act ? null : act;
		this.state.resumeAction = null;
		return this.state.curAction !== null;

	},

	doRest( resume=false ) {

		this.state.resumeAction = resume===true ? this.state.curAction : null;
		this.state.curAction = this.state.restAction;

	},

	setAction( act ) {
		this.state.resumeAction = null;
		this.state.curAction = act;
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

		if ( v instanceof Array ) return v.every( this.filled, this );

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

		this.log.log( evt.name, evt.desc, 'event' );

	},

	/**
	 * Completely disable an item - cannot be purchased/used/etc.
	 * @param {string|Item|Array} it 
	 */
	disable( it ) {

		if ( it instanceof Array ) for( let v of it ) this.disable(v);
		else {

			if ( typeof it === 'string' ) it = this.getItem( it );
			if ( it ) {

				it.disabled = true;

				if ( it == this.state.curHome ) this.state.curHome = null;
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

		} else if ( it instanceof Array ) {
			it.forEach( this.removeAll, this );

		} else {

			let item = this.getItem( it );
			if ( item ) this.remove( it, it.value );
			else {

				item = this.getTagList( it );
				if ( item ) item.forEach( this.removeAll, this );

			}

		}

	},

	/**
	 * Attempt to pay the cost to learn a spell. (Possibly skills later.)
	 * @param {Item} it 
	 * @returns {boolean}
	 */
	tryLearn(it) {

		if ( !this.canUse(it) ) return false;
		this.payCost( it.cost );

		it.cost = it.cast || it.use;
		it.learned = true;

	},

	/**
	 * Attempt to set a new home.
	 * @param {*} it 
	 */
	setHome( it ) {

		let prev = this.state.curHome;

		if ( this.tryItem(it) ) {

			/**
			 * curHome must be removed AFTER to prevent all space being restored.
			 * @todo: fix this.
			*/

			this.state.curHome = it;
			if ( prev ) this.remove( prev );

		}

	},

	/**
	 * Attempt to pay for an item, and if the cost is met, apply it.
	 * @param {Item} it
	 * @returns {boolean}
	 */
	tryItem(it) {

		if ( !this.canUse(it) ) return false;
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

		if ( it.effect ) this.applyEffect(it.effect);
		if ( it.mod ) this.addMod( it.mod, 1 );
		if ( it.lock ) this.lock( it.lock );
		if ( it.dot ) this.beginDot( it, it.dot );
		if ( it.disable ) this.disable( it.disable );

		if ( it.attack ) {
			if ( it.type !== 'wearable' && this.state.curAction === this.state.raid )
				this.state.raid.spellAttack( it );
		}

		return true;

	},

	/**
	 * Remove some amount of an item.
	 * @property {string} id - item id or tag.
	 */
	remove( id, amt=1 ){

		let it = id instanceof Item ? id : this.getItem(id);
		if ( !it ) {

			it = this.state.getTagList(id);
			it = it ? it.find( v=>!v.disabled&& v.value>=amt ) : null;
			if ( !it ) return;

		}

		if ( it.cost && it.cost.space ) this.getItem('space').value += amt*it.cost.space;

		it.value -= amt;
		if ( it.mod ) this.removeMod( it.mod, amt );
		if ( it.lock ) this.unlock( it.lock );

	},

	beginDot( it, dot ) {

		let id = it.id;

		let cur = this.state.player.dots.find( d=>d.id===id);
		if ( cur !== undefined ) cur.duration = dot.duration;
		else {

			this.state.player.dots.push( Object.assign( { id:id, name:it.name }, dot ) );
			if ( dot.mod ) {
				this.addMod( dot.mod, 1 );
			}

		}

	},

	/**
	 * Attempt to unlock an item.
	 * @param {Item} it
	 * @returns {boolean} true on success. 
	 */
	tryUnlock( it ) {

		if ( it.disabled || (it.need && !this.unlockTest(it.need,it)) ) return false;

		else if ( it.require && this.unlockTest(it.require,it) ) {

			this.log.log( 'Unlocked: ' + it.name, it.name + ' has been unlocked.', 'unlock' );
			it.locked = false;

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

		if ( test instanceof Array ) return test.every( v=>this.unlockTest(v,item), this );

		let type = typeof test;
		if ( type === 'function') return test( this._items, item );

		else if ( type === 'string') {

			// test that another item is unlocked.
			let it = this.getItem(test);
			if ( it === undefined ) {

				// tag test - if any item with the tag is unlocked, test passes.
				it = this.state.getTagList(test);
				
				if ( !it ) console.warn('undefined: ' + test );

				return it ? it.some( this.unlockTest, this ) : false;

			}

			// don't need to actually use an action or resource to mark it unlocked.
			if ( it.type === 'resource' || it.type === 'action') return !it.locked;
			return it.value >0;

		} else if ( test instanceof Item ) {

			if ( test.type === 'resource' || test.type === 'action') return !test.locked;
			return test.value >0;

		} else console.warn( 'unknown test: ' + test.id || test );

	},

	/**
	 * Perform the one-time effect of an action, resource, or upgrade.
	 * @param {Item} effect
	 * @param {number} dt - time elapsed.
	 */
	applyEffect( effect, dt=1 ) {

		if ( effect instanceof Array ) for( let e of effect ) this.applyEffect(e,dt);

		else if ( effect instanceof Object ) {

			let target, e;
			for( let p in effect ){

				target = this.getItem(p);
				e = effect[p];

				if ( target === undefined ) this.applyToTag( p, e, dt );
				else if ( target.type === 'event' ) this.doEvent( target );
				else if ( typeof e === 'number' ) target.value += e*dt;
				else if ( e instanceof Range ) target.value += e.value;
				else if ( typeof e === 'boolean') this.doItem( target );
				else target.applyVars(e,dt);
				
			}

		} else if ( typeof effect === 'string') {

			let target = this.getItem(effect);
			if ( target != null ) {

				if ( target.type === 'event') this.doEvent( target );
				else target.applyVars( 1, dt );

			}

		}

	},

	/**
	 * Apply a mod.
	 * @param {Array|Object} mod
	 * @param {number} amt - amount added.
	 */
	addMod( mod, amt ) {

		if ( mod instanceof Array ) mod.forEach( this.addMod, this );
		else if ( typeof mod === 'object' ) {
	
			for( let p in mod ) {

				var target = this.getItem( p );

				if ( target === undefined ) this.applyToTag( p, mod[p], amt );
				else target.applyVars( mod[p], amt );

			}

		}

	},
	
	/**
	 * Apply an effect or mod to all type tags.
	 * @param {string} tag 
	 * @param {Object} obj 
	 * @param {number} dt 
	 */
	applyToTag( tag, obj, dt ) {

		let target = this.state.getTagList(tag);
		if ( target ) target.forEach( v=>v.applyVars( obj, dt ) );

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
	 * Determines whether an item can be run as a continuous action.
	 * @returns {boolean}
	 */
	runnable( it ) {

		return this.canPay( it.cost, TICK_TIME/1000 );

	},

	canUse( it ){

		if ( it.disabled || it.maxed() || (it.need && !this.unlockTest( it.need, it )) ) return false;
		else if ( it.slot ) {

			let list = this.state.getTagList(it.slot );
			if ( list && list.some(v=>!v.locked&&!v.disabled&&v.value>0)) return false;

		}
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
		if ( cost instanceof Array ) return cost.forEach( v=>this.payCost(v,unit), this );

		let res;
		if ( cost instanceof Object ){

			for( let p in cost ) {

				res = this.getItem(p);
				if ( res ) {

					if ( !isNaN(cost[p]) ) res.value -= cost[p]*unit;
					else res.applyVars( cost[p], -unit );


				}

			}

		} else if ( !isNaN(cost ) ) {

			res = this.getItem('gold');
			if ( res ) res.value -= cost*unit;

		}

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
			if ( !res) console.error('Error: Gold is missing');
			if ( res.value < cost*unit) return false;

		}

		return true;
	},

	equip( it, slot=null ) {

		//console.log('equip: ' + it.id );
		let res = this.state.equip.equip( it, slot );
		if ( !res) return;

		this.state.inventory.remove( it );
		if ( typeof res === 'object') {

			if ( res instanceof Array ) res.forEach(v=>{

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

			if ( res instanceof Array ) res.forEach(v=>{
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

		if ( id instanceof Array ) {
			id.forEach( v=>this.lock(v,amt), this );
		} else if ( id instanceof Object ) {

			id.locks += amt;

		} else {

			let it = this.getItem(id);
			if ( it ) {

				it.locks += amt;
				console.log( it.id + ' adding locks: ' + it.locks );

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