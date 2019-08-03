export default class Inventory {

	/**
	 * @property {number} length - items in inventory.
	 */
	get length() { return this.items.length; }

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

		if ( it === null || it === undefined ) return;
		if ( it instanceof Array ) {

			//this.items = this.items.concat(it);
			for( let i = it.length-1; i>=0; i-- ) this.items.push( it[i] );

		} else this.items.push(it);

	}

	removeAt(ind) {
		this.items.splice(ind,1);
	}

	remove( it ){

		let ind = this.items.indexOf( it );
		if ( ind < 0 ) return undefined;
		this.items.splice( ind, 1 );

	}

}