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
		this.multi = Array.isArray( this.item );

		this.name = this.name || this.id;

	}

	/**
	 * 
	 * @param {Item} it - the item to equip in the slot.
	 * @returns {Item|boolean} Item previously held, or true,
	 * if no item needs to be removed.
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
		if ( this.item === null) return null;
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
	 * @returns {?Item|boolean} - If no parameter is specified, removes all items and returns them.
	 * If a param is specified, returns the item removed.
	 */
	remove( it=undefined) {

		if ( this.item === it ) {

			this.item = null;
			return it;

		} else if ( it === null || it === undefined ) {

			it = this.item;
			this.item = null;

			return it;

		} else if ( this.multi ) {

			let ind = this.item.indexOf(it);
			if ( ind < 0 ) return false;
			return this.item.splice(ind,1)[0];

		}

		return false;

	}

	revive( state ) {

		if ( this.item === null || this.item === undefined ) return;
		if ( Array.isArray( this.item) ) this.item.forEach(v=>v.revive(state));
		else this.item.revive(state );

	}

	/**
	 * Return the hands used by a weapon held in this slot.
	 */
	hands() {
		return this.item != null ? this.item.hands || 0 : 0;
	}

	empty(){
		return this.item === null ||
			(Array.isArray(this.item) && this.item.length===0);
	}

}