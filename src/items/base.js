import {changes, jsonify, cloneClass } from 'objecty';
import Percent from '../percent';
import Game from '../game';
import Stat from '../stat';
import Mod from '../mod';

export function mergeClass( destClass, src ) {

	let proto = destClass.prototype;
	let descs = Object.getOwnPropertyDescriptors(src);

	// NOTE: valueOf not overwritten.
	for( let p in descs ) {
		if ( !proto.hasOwnProperty(p) ) Object.defineProperty( proto, p, descs[p]);
	}

	return destClass;

}


 // TODO: restore 'tags' later if tags become dynamic.
 /**
  * @const {string[]} JSONIgnore - ignore these properties by default when saving.
  */
 const JSONIgnore = [ 'template', 'id', 'type', 'defaults', 'name', 'desc',
 	'locked', 'delta', 'tags', 'mod', 'effect', 'progress','need', 'require'];

/**
 * Base class of all Game Objects.
 */
export default {

	/**
	 * Get JSON for a sub-class with additional properties excluded.
	 * @param {string[]} [excludes=null]
	*/
	excludeJSON( excludes ) {

		excludes = excludes ? JSONIgnore.concat( excludes ) : JSONIgnore;

		let vars = changes( jsonify(this, excludes ), this.template || {} );


		if ( this.locked === false && this.template.locked !== false ){
			vars = vars || {};
			vars.locked = this.locked;
		}

		return vars || undefined;

	},


	toJSON() {

		let vars = changes( jsonify(this, JSONIgnore ),
			this.template || {} );

		if ( this.locked === false && this.template.locked !== false ){
			vars = vars || {};
			vars.locked = this.locked;
		}

		return vars || undefined;

	},

	/**
	 * @property {Object} template - data used to create this Item.
	 */
	get template() { return this._template; },
	set template(v) { this._template = v;},

	/**
	 * @property {string} type
	 */
	get type() { return this._type || 'item'; },
	set type(v) { this._type =v;},

	/**
	 * @property {string} id - internal id.
	 */
	toString(){return this.id;},

	/**
	 * @property {string} name - displayed name.
	 */
	get name() { return ( this._actname && this._value < 1 ) ? this.actname : (this._name||this.id); },
	set name(v) { this._name = v;},

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
	 * @property {number} value
	 */
	get value() { return this._value; },
	set value(v) { this._value = v;},
	valueOf() { return this._value; },

	/**
	 * @property {string[]} tags - tag to distinguish between
	 * item subtypes.
	 */
	get tags() { return this._tags;},
	set tags(v) {

		if ( typeof v === 'string') {
			this._tags = v.split(',');
		} else if ( !v ) this._tags = null;
		else if ( typeof v === 'object' ) {
			let a = [];
			for( let p in v ) {
				a.push( v[p] );
			}
			this._tags = a;

		} else {
			this._tags = null;
		}

	},

	/**
	 *
	 * @param {Object} mods - effect/mod description.
	 * @param {number} amt - factor of base amount added
	 * ( fractions of full amount due to tick time. )
	 */
	applyVars( mods, amt=1 ) {

		if ( typeof mods === 'number') { this.value += mods*amt; }
		else if ( typeof mods === 'object' ) {

			if ( mods.mod ) this.changeMod( mods.mod, amt );

			for( let p in mods ) {

				// add any final value last.
				if (  p === 'skipLocked' || p === 'value') continue;

				var targ = this[p];
				if ( targ instanceof Stat || targ instanceof Mod ) {
					//console.log('applying mod to stat: '+ p);
					targ.apply( mods[p], amt );
				} else if ( typeof mods[p] === 'object' ) {

					console.log('subassign: ' + p)
					this.subeffect( this[p], mods[p], amt );

				} else if ( this[p] !== undefined ) {
					console.log('adding: ' + p );
					this[p] += Number(mods[p])*amt;
				} else {
					console.log('NEW SUB: ' + p );
					this.newSub( p, mods[p] )
				}

			}
			if ( mods.value ) this.value += Number(mods.value)*amt;

		}

	},

	/**
	 *
	 * @param {*} mods
	 * @param {number} amt
	 * @param {Object} [targ=null]
	 */
	applyMods( mods, amt=1, targ=null ) {

		targ = targ || this;

		if ( mods instanceof Mod ) {

			mods.applyTo( targ, 'value', amt );

		} else if ( typeof mods === 'object') {

			this.applyObj( mods, amt, targ );

		} else if ( typeof mods === 'number') {

			if ( targ instanceof Stat || targ instanceof Mod ) targ.apply( mods, amt );
			else if ( typeof targ === 'object') {
				console.log('targ is object');
				targ.value = (targ.value || 0 ) + amt*mods;
			}

			// nothing can be done if targ is just a number. no parent object.

		} else console.warn( this.id + ' unknown mod type: ' + mods );

	},

	/**
	 * Apply a mod when the mod is an object.
	 * @param {Object} mod
	 * @param {number} amt - percent of mod added.
	 * @param {Object} targ - target of mods.
	 */
	applyObj( mods, amt, targ ) {

		if ( mods.mod ) this.changeMod( mods.mod, amt );

		for( let p in mods ) {

			var m = mods[p];
			var sub = targ[p];

			if ( sub === undefined || sub === null ) {

				console.log( mods + '["' + p + '"]:' + m + ' -> mod target undefined' );

				sub = targ[p] = ( typeof m === 'number') ? m*amt : cloneClass( m );

			} else if ( m instanceof Mod ) m.applyTo( targ, p, amt );
			else if ( typeof m === 'object' ) {

				this.applyObj( m, amt, sub );

			} else if ( typeof m === 'number' ) {

				if ( typeof sub === 'number') targ[p] += m*amt;
				else this.applyMods( m, amt, sub);

			} else {
				console.warn( `UNKNOWN Mod applied to ${this.id}: ${p}:${m}`);
			}

		}

	},

	/**
	 * Get the value of an object, or a default value.
	 * @param {Object|number} obj
	 * @param {*} def
	 */
	getValue( obj, def=0 ) {
	},

	/**
	 * Perform a subobject assignment.
	 * @param {Object} obj - base object being assigned to.
	 * @param {Object} m - object with subobjects representing assignment paths.
	 * @param {number} amt - amount multiplier for any assignments.
	 */
	subeffect( obj, m, amt ) {

		if ( typeof obj !== 'object' ) {
			console.warn( 'invalid assign: ' + obj + ' = ' + m );
			return;
		}

		for( let p in m ) {

			console.log('assigning sub: ' + p + '=' + m[p]);

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
	newSub( obj, key, mod, amt ) {
		console.warn( this.id + ': UNIMPLEMENTED: ' + mod + ' New SubStat: ' + key );
	},

	/**
	 * Modify a mod applied by the Item.
	 * @param {Object|Mod|number} mod
	 * @param {number} amt - percent of change applied to modifier.
	 */
	changeMod( mod, amt ) {

		if ( this.equippable ) return;
		console.log( this.id + ': adding mod amt: ' + amt );

		// apply change to modifier for existing item amount.
		Game.addMod( mod, amt*this.value );

	},

	/**
	 *
	 * @param {string} tag
	 */
	addTag( tag ) {
		if ( this._tags === null || this._tags === undefined) this._tags = [ tag ];
		else if ( !this._tags.includes(tag) ) this._tags.push(tag);
	},

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

	/**
	 * Test if tag has any tag in the list.
	 * @param {string[]} a - array of tags to test.
	 * @returns {boolean}
	 */
	anyTag( a ) {

		if ( !this._tags ) return false;
		for( let i = a.length-1; i >= 0; i-- ) if ( !this._tags.includes(a[i]) ) return true;

		return false;

	},

	/**
	 *
	 * @param {string} t - tag to test.
	 * @returns {boolean}
	 */
	hasTag( t ) {
		return (this.tags) && this._tags.includes(t); }

}