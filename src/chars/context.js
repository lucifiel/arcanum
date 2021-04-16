import { NpcState } from "./npcState";
import Events, { EVT_EVENT } from "../events";
import { P_TITLE, P_LOG, TYP_PCT, MONSTER } from "../values/consts";
import { TICK_LEN } from '../game';

import { assign, clone } from 'objecty';

/**
 * @interface Context
 * Alternate context for a data item (NPC spellcaster, etc.)
 */
export default class Context {

	get runner() { return this._runner;}
	set runner(v) { this._runner = v;}

	get state(){return this._state;}
	set state(v) { this._state=v}

	/**
	 * @property {Char} self - caster/user of any spell/action.
	 */
	get self(){ return this._state.self; }
	set self(v){ this._state.self = v }

	constructor( stateObj, caster ) {

		this.state = new NpcState( stateObj, caster );

	}

	getData(id){
		return this.state.getData(id);
	}

	tryItem( it ){
	}

	tryUseOn( it, targ ) {
	}

	tryBuy( it ) {
		return true;
	}

	/**
	 * Don't unlock items.
	 * @param {*} test
	 */
	unlockTest(test){
		return false;
	}

	craft(it){
		return true;
	}

	create( it, keep, count=1 ) {

		if ( typeof it === 'string') it = this.state.getData(it);
		else if ( Array.isArray(it) ) {
			for( let i = it.length-1; i>=0; i--) {
				this.create(it[i], false, count);
			}
			return;
		}

		if (!it ) return;

		for( let i = count; i >0; i--) {

			if ( it.type === MONSTER ) {
				if ( it.onCreate ) it.onCreate( this, this.self.team, false );
			}

		}


	}

	filled(){
		return false;
	}

	removeMods( mod, amt ){
		this.applyMods(mod,-amt);
	}

	remove(id, amt) {
	}

	disable(it){
	}

	/**
	 * Use item on target without paying running costs.
	 * Item effects/mods are applied to target.
	 * @param {*} it
	 * @param {*} targ
	 */
	useOn( it, targ ) {
	}
	

	/**
	 * Not implemented.
	 * @param {*} it
	 */
	addTimer(it){
	}

	/**
	 * Not implemented
	 */
	getLoot(){
	}

	/**
	 * Determine if an object cost can be paid before the pay attempt
	 * is actually made.
	 * @param {Array|Object} cost
	 * @returns {boolean} true if cost can be paid.
	 */
	canPay( cost, amt=1 ) {

		if (cost===null||cost===undefined) return true;
		// @note @todo: this doesnt work since some items might charge same cost.
		if (Array.isArray(cost) ) return cost.every( v=>this.canPay(v,amt), this );

		let res;

		if ( typeof cost === 'object' ){

			for( let p in cost ) {

				let sub = cost[p];

				res = this.state.getData(p);
				if ( !res ) return false;
				else if ( res.instanced || res.isRecipe ) {

					/* @todo: ensure correct inventory used. map type-> default inventory? */
					return this.state.inventory.hasCount( res, amt );

				} else if ( !isNaN(sub) || sub.isRVal ) {

					if ( !res.canPay(sub*amt) ) return false;
					//if ( res.value < sub*amt ) return false;

				} else {

					// things like research.max. with suboject costs.
					if ( !this.canPayObj( res, sub, amt ) ) return false;

				}

			}

		}

		return true;
	}

	/**
	 * Follow object path to determine ability to pay.
	 * @param {object} parent - parent object.
	 * @param {object|number} cost - cost expected on parent or sub.
	 * @param {number} amt - cost multiplier.
	 * @returns {boolean}
	 */
	canPayObj( parent, cost, amt=1 ){

		if ( !parent ) return false;

		if ( (cost instanceof RValue) || !isNaN(cost)){
			return parent.value >= cost;
		}

		for( let p in cost ) {

			var val = cost[p];
			if ( !isNaN(val) || (val instanceof RValue) ) {
				if ( parent.value < val*amt ) return false;
			} else if ( typeof val === 'object'){


				//console.log('checking sub cost: ' + p + ' ' +cost.constructor.name );
				//if ( parent ) console.log( 'parent: ' + parent.id );

				if ( !this.canPayObj( parent[p], val, amt ) ) return false;
			}

		}

		return true;
	}

	canEquip(it) {return true;}

	equip(it){
	}

	unequip( slot, it ){
	}

	onUnequip(it){
	}

	/**
	 * Needed for proper item interactions.
	 * @param {*} it
	 */
	setSlot( it ) {
	}

	/**
	 * Default will do nothing for now.
	 * @param {*} cost
	 */
	payCost(cost) {
	}

	canMod(mod){
		return true;
	}

	payInst( p, amt ) {
	}

	setTask(it){

	}

	/**
	 * Determines whether an item can be run as a continuous task.
	 * @returns {boolean}
	 */
	canRun( it ) {

		if ( !it.canRun ) {
			console.error( it.id + ' no canRun()');
			return false;
		} else return it.canRun( this, TICK_LEN );

	}

	/**
	 * Determines whether an item can run again as a continuous task.
	 * @returns {boolean}
	 */
	canRerun(it, itMod) {

		if ( !it.canRun ) {
			console.error( it.id + ' no canRun()');
			return false;
		}
		console.log(it);
		let newIt = assign(assign(Object.create(Object.getPrototypeOf(it), Object.getOwnPropertyDescriptors(it)), clone(it)), itMod);

		console.log(it);
		console.log(newIt);
		
		return !itMod || Object.keys(itMod).length === 0 ? it.canRun(this, TICK_LEN) : newIt.canRun(this, TICK_LEN);
	}

	canUse(it) {
		return true;
	}

	applyMods( mod, amt=1) {

		if ( !mod ) return;

		if ( Array.isArray(mod)  ) {
			for( let m of mod ) this.applyMods(m, amt);
		} else if ( typeof mod === 'object' ) {

			for( let p in mod ) {

				var target = this.getData( p );
				if ( target === undefined || target === null ) continue;
				if ( target.applyMods) {

						target.applyMods( mod[p], amt );

				} else console.warn( 'no applyMods(): ' + target );
			}

		} else if ( typeof mod === 'string') {

			let t = this.getData(mod);
			if ( t ) {

				console.warn('!!!!!!!!!!ADDED NUMBER MOD: ' + mod );
				t.amount( this, 1 );

			}

		}

	}

	applyVars( vars, dt ) {
		
		if (  Array.isArray(vars) ) {
			for( let e of vars ) { this.applyVars( e,dt); }

		} else if ( typeof vars === 'object' ) {

			let target, e = vars[TYP_PCT];
			if ( e && !e.roll() ) return;

			for( let p in vars ){
				
				target = this.getData(p);
				e = vars[p];

				if ( target === undefined || target === null ) {

					if ( p === P_TITLE ) this.self.addTitle( e );
					else if ( p === P_LOG ) Events.emit( EVT_EVENT, e );
					else console.warn( p + ' no effect target: ' + e );

				} else {

					if ( typeof e === 'number' ) {

						target.amount( e*dt );

					} else if ( e.isRVal ) {
						// messy code. this shouldn't be here. what's going on?!?!
						target.amount( dt*e.getApply(this.state, target ) );

					} else if ( e === true ) {

						target.doUnlock(this);
						target.onUse( this );

					} else if ( e.type === TYP_PCT ) {

						if ( e.roll() ) target.amount( 1 );

					} else target.applyVars(e,dt);

				}
			}

		} else if ( typeof vars === 'string') {
			let target = this.getData(vars);
			if ( target !== undefined ) {
				if(target.amount.length === 1){ 
					target.amount( dt ); 
				}
				else if (target.amount.length === 2){ 
					target.amount(this, dt ); 
				}
			}		

		}

	}

}