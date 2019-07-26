export default class Inventory {

	/**
	 * @property {number} length - items in inventory.
	 */
	get length() { return this._items.length; }

	toJSON(){
		return {
			items:(this.items),
			max:(this.max)
		}
	}

	constructor(vars=null){

		if ( vars ) Object.assign(this,vars);

		this.items = this.items || [];
		this.max = this.max || 10;

	}

	add(it){

		if ( it instanceof Array ) {

			for( let i = it.length-1; i>=0; i-- ) this.items.push( it[i] );

		} else this.items.push(it);

	}

	remove( it ){

		if ( !isNaN(it)) {

			this.items.splice(it,1);

		} else {

			let ind = this.items.indexOf()
			if ( ind < 0 ) return undefined;
			this.items.splice( ind, 1 );

		}

	}

}