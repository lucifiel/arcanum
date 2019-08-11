import {changes, jsonify} from 'objecty';

export function mergeClass( destClass, src ) {

	let proto = destClass.prototype;
	/*let props = Object.getOwnPropertyNames(src);
	for( let i = props.length-1; i >= 0; i-- ) {

		if ( proto[props[i]] === undefined ) proto[ props[i] ] = src[ props[i] ];

	}*/

	let descs = Object.getOwnPropertyDescriptors(src);
	for( let p in descs ) {
		if ( proto[p] === undefined ) Object.defineProperty( proto, p, descs[p]);
	}

	return destClass;

}


 // TODO: restore 'tags' later if tags become dynamic.
 /**
  * @const {string[]} JSONIgnore - ignore these properties by default when saving.
  */
 const JSONIgnore = [ 'template', 'id', 'type', 'name', 'desc', 'locked', 'delta', 'tags'];

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
	get name() { return this._name || this.id;},
	set name(v) {
		this._name = v;},

	/**
	 * @property {boolean} repeat - whether the item is repeatable.
	 */

	/**
	 * @property {string} desc
	 */
	get desc() { return this._desc; },
	set desc(v) { this._desc=v;},

	/**
	 * @property {number} value
	 */
	get value() { return this._value; },
	set value(v) { this._value = v;},
	valueOf() { return this._value; },

	/**
	 * @property {string|string[]} tag - tag to distinguish between
	 * item subtypes.
	*/
	get tags() { return this._tags;},
	set tags(v) {

		if ( typeof v === 'string') this._tags = v.split(',');
		else this._tags = v;

	},

	/**
	 * 
	 * @param {Object} m - effect/mod description. 
	 * @param {number} amt - factor of base amount added
	 * ( fractions of full amount due to tick time. )
	 */
	applyVars( m, amt=1 ) {

		if (!isNaN(m)) this.value += m;
		else if ( typeof m === 'object' ) {

			if ( m.max ) {

				let vars = m.max;
				if ( !isNaN(vars) ) this.max += ( vars * amt );
				else if ( typeof vars === 'object' ) {

					if ( vars.base ) this.max.base += vars.base*amt;
					if ( vars.pct ) this.max.pct += vars.pct*amt;
				}
				if ( this.value > this.max.value ) this.value = this.max.value;

			}
			if ( m.mod ) this.changeMod( m.mod, amt );

			for( let p in m ) {

				if ( p === 'rate' || p === 'pct' || p === 'max' || p === 'skipLocked') continue;

				if ( m[p] instanceof Object ) {
					console.log('subassign: ' + p)
					this.subassign( this[p], m[p], amt );
				} else if ( this[p] !== undefined ) {
					//console.log('adding: ' + p );
					this[p] += Number(m[p])*amt;
				} else {
					console.log('NEW SUB: ' + p );
				}

			}

			if ( m.rate ) this.rate.base += m.rate*amt;
			if ( m.pct ) this.rate.pct += m.pct*amt;

		}

	},

	/**
	 * Change a modifier controlled by this Item.
	 * @param {Object} mod
	 * @param {number} amt - percent of change applied to modifier.
	 */
	changeMod( mod, amt ) {

		// apply change to modifier for existing item amount.
		Game.addMod( mod, amt*this.value );

	},

	/**
	 * Perform a subobject assignment.
	 * @param {Object} obj - base object being assigned to.
	 * @param {Object} m - object with subobjects representing assignment paths.
	 * @param {number} amt - amount multiplier for any assignments.
	 */
	subassign( obj, m, amt ) {

		if ( !typeof obj === 'object' ) {
			console.warn( 'invalid assign: ' + obj + ' = ' + m );
			return;
		}

		for( let p in m ) {
		
			console.log('assigning sub: ' + p + '=' + m[p]);

			if ( typeof m[p] === 'object' ) {
				this.subassign( obj[p], m[p], amt );
			} else {
				obj[p] += Number(m[p])*amt;
			}

		}

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
	hasTag( t ) { return this._tags && this._tags.includes(t); }

}