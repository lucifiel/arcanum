import Game from './game';
import Wearable from "./chars/wearable";
import {cloneClass, sublists, randElm, randMatch } from 'objecty';
import Percent from './percent';

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

		this.initMaterials( state.materials );

		this.initList( 'armor', state.armors );
		this.initList( 'weapon', state.weapons );
		this.initList( 'equip', state.equip );
	}

	initMaterials( mats ) {

		this.materials = this.state.matsById;
		this.matsByLevel = sublists( mats, 'level' );

	}

	/**
	 * Generate a new item from a template item.
	 * @param {Wearable} data
	 * @param {string|Material} material - material to use for item.
	 */
	fromData( data, material=null ) {

		//console.log('wearable from data');
		if ( data === null || data === undefined ) return null;

		let mat = material || data.material;
		if ( !mat ) mat = this.getMatBelow( data.level || 1 );

		if ( typeof mat === 'string' ) mat = this.state.getItem( mat );

		return this.itemClone( data, mat );

	}

	/**
	 * Generate loot from looting info.
	 * @param {string|Wearable|Object|Array} info
	 * @returns {?Wearable|Wearable[]}
	 */
	getLoot( info, amt=1 ) {

		if ( amt instanceof Percent ) {
			if ( !amt.value ) return null;
		} else if ( amt.value ) amt = amt.value;

		if ( typeof info === 'string' ) {
			info = this.state.getItem(info);
		}
		if (!info) {
			console.log('skipping NULL gen.')
			return null;
		}

		if ( info.type === 'wearable') return this.fromData( info );
		else if ( info.type != null ) Game.doItem( info, amt );
		else if ( info instanceof Array ) return info.map( this.getLoot, this );

		if ( info.pct && (100*Math.random() > info.pct) ) return null;
		if ( info.level ) return this.fromLevel( info.level, info.kind, info.material );
		else if ( info.max ) return this.rand( info.max, info.kind, info.material );

		let items = [];
		for( let p in info ) {
			var it = this.getLoot( this.state.getItem(p), info[p] );
			if ( it ) items.push(it );
		}

		return items;

	}

	/**
	 * Return a random item of the given level.
	 * @param {number} [level=0] 
	 * @param {?string} [kind=null]
	 * @param {?string|Material} [mat=null] - item material.
	 */
	fromLevel( level=0, kind=null, mat=null ){

		kind = kind || this.pickKind();

		let list = this.byLevel[kind];
		if ( list ) {

			list = list[level];
			if ( list ) {
				let it = randElm( list );
				return this.fromData( it, mat );
			}


		}

		return null;

	}

	/**
	 * Get random item of given level or below.
	 * @param {number} [maxLevel=1] - maximum level of item to return.
	 * @param {?string} [kind=null] - kind of item to generate.
	 * @param {?string|Material} [mat=null] - item material.
	 * @returns {Wearable|null}
	 */
	rand( maxLevel=1, kind=null, mat=null ){

		maxLevel = Math.floor( Math.random()*(maxLevel+1) );
		do {
			var it = this.fromLevel( maxLevel, kind, mat );

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

	/**
	 * Get a material below or including the given level.
	 * @param {number} level 
	 * @param {string} itemKind 
	 */
	getMatBelow( level, itemKind=null ) {
		return this.getMat( Math.floor( Math.random()*level + 1 ), itemKind );
	}

	/**
	 * Get a random material of the highest level available on or below
	 * the given level.
	 * @param {number} level - target level of material.
	 * @param {?string} itemKind 
	 */
	getMat( level, itemKind=null ) {

		do {

			var arr = this.matsByLevel[level];
			if ( !arr ) continue;

			var it = itemKind == null ? randElm(arr) :
				randMatch( arr, v=>!v.exclude||v.exclude.includes(itemKind) );

		} while ( !it && --level >= 0 );

		return it;

	}

	pickKind() {

		let r = Math.random();
		if ( r < 0.33 ) return 'armor';
		if ( r < 0.66 ) return 'weapon';
		return 'equip';

	}

	itemClone( data, material ) {

		data = new Wearable(data);

		if ( material ) {
			data.applyMaterial( material );
			data.name = material.id + ' ' + data.name;
		} else data.name = data.name;

		data.id = data.id + this.state.nextId();

		return data;
	}


}