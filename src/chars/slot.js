/**
 * Equipment slot.
 */
export default class Slot {

	toJSON(){
		return {
			id:this.id,
			item:JSON.stringify(this.item),
			multi:this.multi,
			max:JSON.stringify(this.max)
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
	 * @param {*} it
	 * @returns {boolean} true on success.
	 */
	equip( it ){

		if ( this.multi === true ) {

		} else if ( !this.item ) {
	
			this.item = it;
			return true;

		}

		return false;

	}

	/**
	 * 
	 * @param {*} it 
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

		if (!it) {

			it = this.item;
			this.item = null;

			return it;

		} else if ( this.multi ) {

			let ind = this.item.indexOf(it);
			if ( ind < 0 ) return false;
			this.item.splice(ind,1);

		} else if ( this.item === it ) {

			this.item = null;
			return true;

		}

		return false;

	}

	empty(){
		return this.item === null ||
			((this.item instanceof Array) && this.item.length===0);
	}

}