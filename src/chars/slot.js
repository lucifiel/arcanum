/**
 * Equipment slot.
 */
export default class Slot {

	toJSON(){
		return {
			id:this.id,
			item:this.item,
			multi:this.multi,
			max:this.max
		}
	}

	constructor(vars=null){

		if ( vars ) Object.assign( this, vars);

		this.item = this.item || ( this.max ? [] : null );

		/**
		 * @property {boolean} multi - true if slot holds multiple items.
		 */
		this.multi = this.item instanceof Array;

		if ( !this.name ) this.name = this.id;

	}

	/**
	 * 
	 * @param {Item} it
	 * @returns {Item|boolean} Item previously held, or true.
	 */
	equip( it ){

		if ( this.multi === true ) {

			this.item.push(it);
			if ( this.item.length > this.max ){
				return this.item.shift();
			}
			return true;

		} else if ( !this.item ) {
	
			this.item = it;
			return true;

		}

		let tmp = this.item;
		this.item = it;

		return tmp;

	}

	/**
	 * Find item in slot by id.
	 * @param {string} id 
	 * @returns {Item|null}
	 */
	find(id ) {
		return this.multi ?
			this.item.find(v=>v.id===id) :
			(this.item.id === id) ? this.item : null
	}

	/**
	 * 
	 * @param {*} it
	 * @returns {boolean}
	 */
	has(it) {
		return (this.multi === false ) ? this.item === it : this.item.includes(it);
	}

	/**
	 * Remove item from slot.
	 * @param {?Item} [it=null] - item to remove. If item is null, any item(s) in slot are removed.
	 * @returns {?Item|boolean} - If no parameter is specified, returns any items removed.
	 * If a param is specified, returns true if item removed, false otherwise.
	 */
	remove( it=undefined) {

		if ( it == null ) {

			it = this.item;
			this.item = null;

			return it;

		} else if ( this.multi ) {

			let ind = this.item.indexOf(it);
			if ( ind < 0 ) return false;
			return this.item.splice(ind,1)[0];

		} else if ( this.item === it ) {

			this.item = null;
			return true;

		}

		return false;

	}

	/**
	 * Return the hands used by a weapon held in this slot.
	 */
	hands() {
		return this.item != null ? this.item.hands || 0 : 0;
	}

	empty(){
		return this.item === null ||
			((this.item instanceof Array) && this.item.length===0);
	}

}