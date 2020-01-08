/**
 * Implements Set class using Array for Vue reactivity.
 */
export default class ArraySet {

	get size(){return this._store.length; }

	[Symbol.iterator](){
		return this._store[Symbol.iterator]();
	}

	/**
	 *
	 * @param {?Iterable} a
	 */
	constructor( a ) {

		this._store = [];

		if ( a ) {
			for( let it of a ) this.add(it);
		}

	}

	clear(){
		this._store = [];
	}

	forEach(p){
		return this._store.forEach(p);
	}

	values(){
		return this._store.slice(0);
	}

	add( it ){
		this._store.push(it);
	}

	has(it){
		return this._store.includes(it);
	}

	delete( it){

		let ind = this._store.indexOf(it);
		if ( ind < 0) return false;
		this._store.splice(ind, 1);
		return true;

	}

}