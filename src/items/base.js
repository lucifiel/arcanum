import {changes, jsonify, cloneClass  } from 'objecty';
import Game from '../game';
import Stat from '../values/stat';
import Mod from '../values/mod';
import { TYP_MOD } from '../values/consts';
import RValue, { SubPath } from '../values/rvalue';
import { Changed } from '../techTree';
import { ParseMods } from '../modules/parsing';

export const SetModCounts = ( m, v)=>{

	if ( m instanceof Mod ) {
		//console.log('setting mod count: ' + m.id + ' val: ' + v );
		m.count = v;
	}
	else if ( typeof m ==='object') {
		for( let p in m ){ SetModCounts(m[p], v); }
	}

}


export const mergeClass = ( destClass, src ) => {

	let proto = destClass.prototype || destClass;
	let descs = Object.getOwnPropertyDescriptors(src);

	// NOTE: valueOf not overwritten.
	for( let p in descs ) {
		if ( !proto.hasOwnProperty(p) ) Object.defineProperty( proto, p, descs[p]);
	}

	return destClass;

}


 /**
  * @todo shorten list by implementing better base/defaults logic.
  * @const {Set.<string>} JSONIgnore - ignore these properties by default when saving.
  */
 const JSONIgnore = new Set( ['template', 'id', 'type', 'defaults', 'module', 'sname', 'sym', 'warn', "effect",
 	'name', 'desc', 'running', 'current', 'warnMsg', 'once', 'context', 'enemies', 'spawns','targets','only',
	 'locked', 'locks', 'value', 'exp', 'delta', 'tags', 'mod', 'progress','need', 'require','action' ]);

/**
 * Base class of all Game Objects.
 */
export default {

	toJSON() {

		if ( this.save && (this.value>0||this.owned)) return this.forceSave();

		let vars = jsonify(this, JSONIgnore );
		if ( this.template ) vars = changes( vars, this.template );

		if ( this.locked === false && this.template && this.template.locked !== false ){
			vars = vars || {};
			vars.locked = this.locked;
		}
		if ( vars && vars.name ) vars.name = this.sname;

		return vars || undefined;

	},

	forceSave(){

		let data = jsonify(this);
		if ( this.mod ) data.mod = this.mod;
		if ( this.slot ) data.slot = this.slot;
		if ( this.effect) data.effect = this.effect;
		if ( this.use ) data.use = this.use;

		if ( data.template && typeof data.template === 'object' ) data.template = data.template.id;
		if ( data.val ) data.value = undefined;
		data.name = this.sname;

		return data;

	},

	get id() { return this._id; },
	set id(v) { this._id = v;},

	/**
	 * @property {Object} template - original data used to create this Item.
	 * Should be raw, immutable data.
	 */
	get template() { return this._template; },
	set template(v) { this._template = v;},

	/**
	 * @property {string} type
	 */
	get type() { return this._type },
	set type(v) { this._type =v;},

	get typeName(){return this._type;},

	/**
	 * @property {string} id - internal id.
	 */
	toString(){return this.id;},

	/**
	 * Simple name without symbol.
	 */
	get sname(){ return this._name || this.id; },

	/**
	 * @property {string} name - displayed name.
	 */
	get name() { return (( this._actname && this._value < 1 ) ? this.actname
		: (this.sym||'') + (this._name||this.id));
	},
	set name(v) {

		if ( v&&this.sym ) {

			this._name = v.split(this.sym).join( '').trim();

		} else this._name = v;


	},

	/**
	 * @property {boolean} repeat - whether the item is repeatable.
	 */

	/**
	 * @property {string} desc
	 */
	get desc() { return ( this.actdesc && this._value < 1 ) ? this.actdesc : (this._desc || null ); },
	set desc(v) { this._desc=v;},

	/**
	 * @property {number} current - displayable value; override in subclass for auto rounding, floor, etc.
	 */
	get current() { return this.value },

	/**
	 * @property {number} ex - save/load alias for exp without triggers.
	 */
	get ex(){return this._exp; },
	set ex(v) { this._exp = v;},

	/**
	 * @property {number} val - saving/loading from json without triggers.
	 */
	get val() { return this._value },
	set val(v) { this._value = v; },

	/**
	 * @property {number} value
	 */
	get value() { return this._value; },
	set value(v) { this._value = v; },
	valueOf() { return this._value; },

	/**
	 * @property {string[]} tags - tag to distinguish between
	 * item subtypes.
	 */
	get tags() { return this._tags;},
	set tags(v) {

		if ( typeof v === 'string') {
			this._tags = v.split(',');
		} else if ( Array.isArray(v) ) {

			this._tags = v;

		} else this._tags = null;

	},

	permVars( mods, targ=this ) {

		//console.log( 'PERM VARS: ' + typeof mods);
		//console.log('eNC TARG: ' + typeof targ);
		if ( typeof targ === 'number') {

			// error.

		} else if ( typeof mods === 'object') {

			for( let p in mods ) {

				var mod = mods[p];
				var sub = targ[p];

				if ( sub === undefined || sub === null ) {

					sub = targ[p] = cloneClass( mod );

				} else if ( typeof mod === 'object' ) {

					if ( sub.constructor !== Object ) sub.perm( mod );
					else this.permVars( mod, sub );

				} else if ( !sub || typeof sub === 'number') {

					targ[p] = (sub||0) + mods[p].valueOf();

				}
				else console.log( this.id + ' UNKNOWN PERM VAR: ' + p + ' typ: ' + (typeof sub ));


			}

			if ( typeof targ === 'object' && targ && mods.mod ) {
				ParseMods( this.mods, this.id, this );
				//SetModIds( targ.mod, targ.id );
			}

		}

	},

	/**
	 *
	 * @param {Object} vars - values to change/add.
	 * @param {number} amt - factor of base amount added
	 * ( fractions of full amount due to tick time. )
	 */
	applyVars( vars, amt=1 ) {

		if ( typeof vars === 'number') {

			//deprec( this.id + ' mod: ' + mods );
			this.value.add( vars*amt );

		} else if ( vars.isRVal ) {

			//this.amount( Game, mods*amt );
			this.value.add( amt*vars.getApply( Game.state, this ) );


		} else if ( typeof vars === 'object' ) {

			if ( vars.mod ) this.changeMod( vars.mod, amt );

			for( let p in vars ) {

				// add any final value last.
				if (  p === 'skipLocked' || p === 'value') continue;

				var targ = this[p];
				if ( targ instanceof RValue ) {

					//console.log('APPLY ' + vars[p] + ' to stat: '+ this.id + '.'+ p + ': ' + amt*vars[p] + ' : ' + (typeof vars[p]) );
					//if ( typeof (targ) === 'object') console.log('obj targ: ' + targ.constructor.name );

					targ.apply( vars[p], amt );

				} else if ( typeof vars[p] === 'object' ) {

					if ( vars[p].type === TYP_MOD ) {

						vars[p].applyTo( this, p, amt );

					} else if ( typeof targ === 'number' ) {

						//deprec( this.id + ' targ: ' + p + ': ' + targ );
						this[p] += Number(vars[p])*amt;
					} else {
						//console.log( mods + ' subapply: ' + p);
						this.subeffect( this[p], vars[p], amt );
					}

				} else if ( this[p] !== undefined ) {

					//console.log( this.id + ' adding vars: ' + p );
					this[p] += Number(vars[p])*amt;

				} else {
					console.log('NEW SUB: ' + p );
					this.newSub( this, p, vars[p], amt )
				}

			}
			if ( vars.value ) this.value += (vars.value)*amt;

		}


		Changed.add(this);

	},

	/**
	 *
	 * @param {Mod|Object} mods
	 * @param {number} amt
	 * @param {Object} [targ=null]
	 */
	applyMods( mods, amt=1, targ=this ) {

		Changed.add(this);

		if ( mods instanceof Mod ) {

			mods.applyTo( targ, 'value', amt );
			if ( this.mod ) this.modChanged(Game);

		} else if ( mods.constructor === Object ) {

			this.applyObj( mods, amt, targ );
			if ( mods.mod ) {
				this.modChanged(Game);
			}

		} else if ( typeof mods === 'number') {

			if ( targ instanceof Stat ) {

				console.error( '!!!!! ' + mods + ' number apply to: ' + this.id );
				targ.add( mods*amt );

			} else if ( typeof targ === 'object') {

				console.warn( this.id + ' TARG is RAW OBJECT: ' + mods );
				targ.value = (targ.value || 0 ) + amt*mods;

			} else {
				// nothing can be done if targ is a number. no parent object.
				console.error( this.id + ' !!invalid mod: ' + mods );
			}
			if ( this.mod ) this.modChanged(Game);

		} else console.warn( this.id + ' unknown mod type: ' + mods );

	},

	/**
	 * Apply a mod when the mod is recursive object.
	 * @param {Object} mod
	 * @param {number} amt - percent of mod added.
	 * @param {Object} targ - target of mods.
	 * @param {boolean} isMod - whether target is subobject of a mod object.
	 */
	applyObj( mods, amt, targ, isMod=false ) {

		for( let p in mods ) {

			var subMod = mods[p];
			var subTarg = targ[p];

			if ( subTarg === undefined || subTarg === null ) {

				if ( subMod.constructor === Object ) {

					targ[p] = {};
					this.applyObj( subMod, amt, targ[p], p==='mod'|| isMod );

				} else {
					subTarg = targ[p] = isMod ? new Mod( typeof subMod === 'number' ? subMod*amt :0 )
						: new Stat( typeof subMod === 'number' ? subMod*amt : 0 );

										//@todo use more accurate subpath.
					subTarg.id = SubPath(this.id, p );

					subTarg.source = this;


					if ( subMod instanceof Mod ) subTarg.addMod( subMod,amt );
					console.log( this.id + '.' + p  + ': ' + subMod + ': targ null: ' + subTarg.valueOf() + ' mod? ' + isMod );
				}


			} else if ( subTarg.applyMods ) {

				subTarg.applyMods( subMod, amt, subTarg );

			} else if ( subTarg instanceof Stat) {

				//console.log(' apply : ' + m + ' type: ' + (typeof m) );
				subTarg.apply( subMod, amt );

			} else if ( subMod instanceof Mod ) {
				subMod.applyTo( targ, p, amt );
			} else if ( subMod.constructor === Object ) {

				this.applyObj( subMod, amt, subTarg, p==='mod'||isMod );

			}
			else if ( typeof subMod === 'number' ) {

				if ( typeof subTarg === 'number') {

					/// @todo stat switch?
					console.warn('MOD APPLIED TO RAW NUM: ' + p + ' : ' + (m*amt ) );
					targ[p] = new Stat( targ[p] + subMod*amt, SubPath(this.id, p) );
					//targ[p] += m*amt;

				} else this.applyMods( subMod, amt, subTarg);

			} else {

				console.warn( `UNKNOWN Mod to ${this.id}.${p}: ${subMod}` + '  ' + typeof subMod);
			}

		}

	},

	/**
	 * Perform a subobject assignment.
	 * @param {Object} obj - base object being assigned to.
	 * @param {Object} m - object with subobjects representing assignment paths.
	 * @param {number} amt - amount multiplier for any assignments.
	 */
	subeffect( obj, m, amt ) {

		if ( typeof obj !== 'object' ) {
			//console.warn( 'invalid assign: ' + obj + ' = ' + m );
			return;
		}

		for( let p in m ) {

			//console.log('SUBEFFECT(): ' + p + '=' + m[p]);

			if ( typeof m[p] === 'object' ) {
				this.subeffect( obj[p], m[p], amt );
			} else {

				if ( typeof obj[p] === 'object') {

					obj[p].value = ( obj[p].value || 0 ) + Number(m[p])*amt;

				} else obj[p] += Number(m[p])*amt;

			}

		}

	},

	/**
	 * Add new sub-object to this object.
	 * Vue reactivity??
	 * @todo
	 * @param {Object} obj - parent object.
	 * @param {string} key - prop key to set.
	 * @param {Object} mod - modify amount.
	 * @param {number} amt - times modifier applied.
	 */
	newSub( obj, key, mod, amt=1 ) {

		console.warn( 'ADD SUB: ' + this.id + ' ' + key + ' stat: ' + (amt*mod.value) );

		let s = obj[key] = new Stat( typeof mod === 'number' ? mod*amt : 0, 'key' );
		if ( mod instanceof Mod ) s.apply( mod, amt );

	},

	modChanged(g){
		g.applyMods(this.mod, this.value);
	},

	/**
	 * Modify a mod applied by the Item.
	 * @param {Object|Mod|number} mod
	 * @param {number} amt - percent of change applied to modifier.
	 */
	changeMod( mod, amt ) {

		// @todo: why? assume not currently worn?
		if ( this.equippable ) return;

		// apply change to modifier for existing item amount.
		Game.applyMods( mod, amt*this.value );

	},

	/**
	 * Add tag to object.
	 * @param {string} tag
	 */
	addTag( tag ) {
		if ( this._tags === null || this._tags === undefined) this._tags = [ tag ];
		else if ( !this._tags.includes(tag) ) this._tags.push(tag);
	},

	/**
	 *
	 * @param {string} t - tag to test.
	 * @returns {boolean}
	 */
	hasTag( t ) { return (this.tags) && this._tags.includes(t); },

	/**
	 * Test if item has every tag in list.
	 * @param {string[]} a - array of tags to test.
	 * @returns {boolean}
	*/
	hasTags( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return false;

		return true;

	},

	canUse(){return true;},

	/**
	 * Test if tag has any tag in the list.
	 * @param {string[]} a - array of tags to test.
	 * @returns {boolean}
	 */
	/*anyTag( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return true;

		return false;

	},*/

}