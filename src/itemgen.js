import Game from './game';
import Wearable from "./items/wearable";
import {cloneClass} from 'objecty';
import Percent from './percent';

/*function isPercent(str) {
	return str[str.length-1] === '%';
}*/

/**
 * @constant {number} ITEM_ID - number to append to item ids
 * to give every cloned item a unique id.
 */
var ITEM_ID = 0;

/**
 * Generates random Equipment Items and Weapons from basic item data.
 */
export default class ItemGen {

	constructor( state ){

		this.state = state;

		/**
		 * Iitem lists by kind then level.
		 * @property {Object.<string,Object.<number,Wearable[]>>} byLevel
		 */
		this.byLevel = {};

		/**
		 * Item lists by kind.
		 * @property {Object.<string,Item[]>} byKind
		 */
		this.byKind = {};

		this.initList( 'armor', state.armors );
		this.initList( 'weapon', state.weapons );
		this.initList( 'equip', state.equip );
	}

	_itemClone(data) {
		data = cloneClass(data);
		data.id = data.id + ITEM_ID++;
		return data;
	}

	/**
	 * Generate an item from base item.
	 * @param {Wearable} data 
	 */
	fromData( data ) {

		if ( data === null || data === undefined ) return null;
		return this._itemClone(data);

	}

	/**
	 * Generate loot from looting info.
	 * @param {string|Wearable|Object|Array} info
	 * @returns {?Wearable|Wearable[]}
	 */
	getLoot( info ) {

		if ( typeof info === 'string' ) return this.fromData( this.state.getItem(info) );
		else if ( info.type === 'wearable') return this.fromData( info );
		else if ( info instanceof Array ) return info.map( this.getLoot, this );

		if ( info.pct && (100*Math.random() > info.pct) ) return null;

		if ( info.level ) return this.fromLevel( info.level, info.kind );
		else if ( info.max ) return this.rand( info.max, info.kind );

		let items = [];
		for( let p in info ) {

			var it = this.state.getItem(p);
			if ( !it ) {
				console.log('LOOT UNDEFINED: ' + p );
				continue;
			}			
			var itVal = info[p];

			if ( itVal instanceof Percent ) {
				if ( !itVal.value ) continue;
			} else if ( itVal.value ) itVal = itVal.value;

			if ( it.type === 'wearable') items.push( this.fromData(it) );

			// loot is resource/skill/status effect etc.
			else Game.doItem(it, itVal );


		}

		return items;

	}

	/**
	 * 
	 * @param {number} [level=0] 
	 * @param {?string} [kind=null] 
	 */
	fromLevel( level=0, kind=null ){

		kind = kind || this.pickKind();

		let list = this.byLevel[kind];
		if ( list ) {

			list = list[level];
			if ( list ) {
				let it = list[ Math.floor( Math.random()*list.length ) ];
				console.log( 'cloning ' + it );
				return this._itemClone( it );
			}


		}

		return null;

	}

	/**
	 * Get random item of maximum level of below.
	 * @param {number} [maxLevel=1]
	 * @param {?string} [kind=null] kind of item to generate.
	 * @returns {Wearable|null}
	 */
	rand( maxLevel=1, kind=null ){

		maxLevel = Math.floor( Math.random()*(maxLevel+1) );
		do {
	
			var it = this.fromLevel( maxLevel, kind );

		} while ( !it && --maxLevel >= 0 );

		return it;
	}

	initList( kind, list ) {

		if ( !list ) {
			console.warn( 'list: ' + kind + ' undefined.');
			return;
		}
		/**
		 * Maps item level to item types of the appropriate level.
		 * Object.<number,item[]>
		 */
		let byLevel = {};
		let levelArr;

		for( let i = list.length-1; i>= 0; i-- ) {

			var it = list[i];
			levelArr = byLevel[ it.level ] || (byLevel[it.level] = []);

			levelArr.push(it);

		}

		this.byKind[kind] = list || [];
		this.byLevel[ kind ] = byLevel;


	}

	pickKind() {

		let r = Math.random();
		if ( r < 0.33 ) return 'armor';
		if ( r < 0.66 ) return 'weapon';
		return 'equip';

	}


}