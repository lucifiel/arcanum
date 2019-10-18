import { loadFiles, prepData, freezeData } from '../dataLoader';

import Resource from './items/resource';
import ZeroSum from './items/zerosum';
import RevStat from './items/revStat';
import StatData from './items/statData';
import Skill from './items/skill';
import Monster from './items/monster';

import Dungeon from './items/dungeon';
import Locale from './items/locale';

import Spell from './items/spell.js';
import Action from './items/action';

import { mergeSafe } from 'objecty';
import ProtoItem from './items/protoItem';
import Material from './chars/material';
import Enchant from './items/enchant';
import Item from './items/item';
import Potion from './items/potion';
import Encounter, { ENCOUNTER } from './items/encounter';
import GEvent from './items/gevent';

import Encounter, { ENCOUNTER } from './items/encounter';

import RevStat from '../items/revStat';
import ZeroSum from '../items/zerosum';
import Item from '../items/item';
import Locale from '../items/locale';

/**
 * Class for loading and storing module json in a well-defined format.
 */
export default class Module {

	/**
	 * @property {.<string,object>} templates - raw untyped object templates.
	 * used for reloading and comparing for data save.
	 */
	get templates() { return this._templates; }
	set templates(v) { this._templates =v; }

	/**
	 * @property {string} name
	 */
	get name() {return this._name;}
	set name(v) { this._name=v;}

	/**
	 * @property {string} sym
	 */
	get sym(){return this._sym; }
	set sym(v) {this._sym =v;}

	/**
	 * @property {object.<string,GData>} items - index of all items.
	 */
	get items() { return this._items; }
	set items(v){this._items=v;}

	/**
	 * Lists of items by type of data.
	 * @property {Object.<string,object[]>}
	*/
	get lists(){return this._lists; }
	set lists(v){this._lists=v;}

	/**
	 *
	 * @param {?object} [data=null]
	 */
	constructor( data ) {
	}

	/**
	 * Directly set module data in json-module format.
	 * @param {object} data
	 */
	setData( data ) {
		this.fileLoaded(data);
	}

	/**
	 * Load module data file.
	 * Resolves to the module on load.
	 * @returns {Promise.<GModule>}
	 */
	load( file ) {

		this.file = file;

		this.lists = {};
		this.items = {};
		this.templates = {};

		if ( Array.isArray(this.file) ) {

			return loadFiles( this.file ).then( (v)=>this.typesLoaded(v) );

		} else {
			// files returned as string->file data mapping. get the file data itself.
			return loadFiles( [ this.file ] ).then( (v)=>this.fileLoaded( v[this.file] ) );

		}

	}

	/**
	 * Separate module files loaded. Each file is a list of objects
	 * of the same type.
	 * @param {.<string,object[]>} files
	 */
	typesLoaded(files) {

		/**
		 * Precheck for submodule files.
		 */
		let modules = [];
		for( let p in files ) {

			var file = files[p];
			if ( file.module ) {

			} else {
				this.lists[p] = this.parseList( lists[p] );
			}

		}

		// marge in submodules.

	}

	/**
	 * Single Module file loaded.
	 * @param {object} mod
	 */
	fileLoaded( mod ) {

		if ( !mod ) {
			console.warn( this.file + ' data missing' );
			return;
		}

		this.name = mod.module || this.file;
		this.sym = mod.sym;

		if ( mod.data ){
			this.parseLists( mod.data );
		}

		return this;

	}

	/**
	 *
	 * @param {.<string,object[]} lists
	 */
	parseLists( lists ){

		for( let p in lists ) {
			this.lists[p] = this.parseList( lists[p] );
		}

	}

	/**
	 * Perform initial parsing of a list of untyped data objects.
	 * @param {object[]} arr
	 */
	parseList( arr ){

		let sym = this.sym;

		for( let i = arr.length-1; i >= 0; i-- ) {

			var it = arr[i];
			if ( !it.id ){
				console.warn('missing id: ' + it.name );
				continue;
			}
			if ( sym ) it.sym = it.sym || sym;

			this.templates[ it.id ] = freezeData( it );

			arr[i] = it = prepData(it);
			this.items[it.id] = it;

		}

	}

	/**
	 * Merge module into this module.
	 * @param {GModule} mod
	 * @param {*} insertLists
	 */
	merge( mod ) {

		let items = mod.templates;
		let dest = this.templates;

		for( let p in items ) {
			dest[p] = items[p];
		}

		for( let p in mod.lists ) {

			let list = mod.lists[p];
			dest = this.lists[p];

			if ( !Array.isArray(dest)) {

				console.warn( 'DEST NOT ARRAY: ' + p );
				this.lists[p] = list.slice(0);
				continue;

			}

			for( let i = list.length-1; i >= 0; i-- ) {
				dest.push( list[i] );
			}


		}


	}

	/**
	 * Use module templates to create instanced data and instanced data lists.
	 * @param {object} saveData
	 */
	instance( saveData={} ){
	}

}