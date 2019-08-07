import Game from '../game';

/**
 * @const {RegExp} FuncRE - regular expression to find tree relationships
 * in requirement/need functions.
 */
const FuncRE = /state\.((?:\w|\.)+)/gi;

export default class TechTree {

	/**
	 * 
	 * @param {Object} [vars=null] 
	 */
	constructor( items ) {

		this.items = items;

		/**
		 * @property {Object.<string,Array>} unlocks - maps item id to target Items
		 * the id Item could potentially unlock.
		 */
		this.unlocks = {};

		for( let p in this.items ) {

			this.mapTree( this.items[p]);

		}

	}

	/**
	 * Mark all Items which might potentially unlock this item.
	 * @param {Item} item 
	 */
	mapTree( item ) {

		if ( !item.locked || item.disabled ) return;

		if ( item.require ) this.markLinks( item, item.require );
		if ( item.need ) this.markLinks( item, item.need );

	}

	markLinks( item, need ) {

		let type = typeof need;

		if ( type === 'string') {

			this.markUnlock( need, item );

		} else if ( type === 'function' ) {

			this.markFunc( item, need );

		} else if ( need instanceof Array ) return need.forEach( v=>this.markLinks(item,v), this );

	}

	/**
	 * Mark unlock links from a requirement function.
	 * @param {Item} item - item being unlocked. 
	 * @param {function} func - function testing if item can be unlocked.
	 */
	markFunc( item, func ) {

		let text = func.toString();
		let results;
		while ( results = FuncRE.exec( text )) {

			//var varPath = results[1];
			//console.log( item.id + 'require: ' + varPath );

			this.markUnlock( results[1].split('.')[0], item );

		}
		if ( text.includes('this') ) this.markUnlock( item.id, item );

	}

	/**
	 * Map src as an unlocker of item.
	 * @param {string} src 
	 * @param {Item} item 
	 */
	markUnlock( src, item ) {

		if ( !src) return;
		let it = this.items[src];
		if ( !it ) {
			it = Game.state.getTagList( src );
			if ( it ) it.forEach( v=>this.markUnlock(v,item) );
			return;
		}

		let map = this.unlocks[src];
		if ( map === undefined ) this.unlocks[src] = map = {};

		map[item.id] = true;

	}

	/**
	 * Call when some variable of src Item changes.
	 * Test unlocks on all variables linked by a possible unlock chain.
	 * @param {string} src 
	 */
	changed( src ){

		let links = this.unlocks[src];
		if ( links === undefined) return;

		let it;
		let count = 0;
		for( let p in links ) {

			it = this.items[p];
			if ( it.locked === false || it.disabled === true || Game.tryUnlock(it) ) {

				// remove unlock link.
				links[p] = undefined;

			} else count++;

		}
		if ( count === 0 ) this.unlocks[src] = undefined;

	}

}