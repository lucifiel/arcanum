import Wearable from "./items/wearable";

export default class Inventory {

	/**
	 * @property {number} length - items in inventory.
	 */
	get length() { return this.items.length; }

	toJSON(){
		return {
			items:(this.items),
			max:(this.max),
			NEXT_ID:this.NEXT_ID
		}
	}

	constructor(vars=null){

		if ( vars ) Object.assign(this,vars);

		if ( this.items )this.items = this.items.map( v=>new Wearable(v) );
		else this.items = [];

		this.max = this.max || 10;

	}

	revive(state){
		this.items.forEach(v=>v.revive(state));
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