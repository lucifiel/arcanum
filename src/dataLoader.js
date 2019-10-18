import GData from './items/gdata';
import Player from './chars/player';

import Range, {RangeTest} from './values/range';
import Percent, {PercentTest} from './values/percent';
import {ParseMods } from './values/mod';

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

import Loader from './util/jsonLoader';
import { splitKeyPath } from './util/util';
import GClass from './items/gclass';

const DataDir = './data/';
const DataFiles = [ 'resources', 'upgrades', 'actions', 'homes', 'furniture', 'items', 'skills',
	'player', 'spells', 'monsters', 'dungeons', 'events', 'classes', 'armors', 'weapons',
	'materials', 'enchants', 'sections', 'potions', 'encounters', 'locales','stressors', 'seasonal' ];

/**
 * @const {RegEx} IdTest - Test for a simple id name.
 */
const IdTest = /^[A-Za-z_]+\w*$/;

export const loadFiles = ( fileList, dir=DataDir ) => {

	let loader = new Loader( dir, fileList );
	return loader.load();

}

/**
 * @todo replace with server call.
 */
export default {

	/**
	 * @property {.<string,object>} templates - default untyped object templates.
	 * item id => untyped object data.
	 */
	templates:null,

	/**
	 * Lists of items for each item type.
	 * (item source file/item type) => item list
	 *
	 * @property {.<string,object[]>}
	 */
	dataLists:null,

	async loadGame( saveData ) {

		if ( this.templates === null ) {

			return loadFiles( DataFiles, DataDir ).then(
			(v)=>{

				this.dataLists = this.datasLoaded(v);
				return this.instance( this.templates, this.dataLists, saveData );

			});

		} else return this.instance( this.templates, this.dataLists, saveData );

	},

	/**
	 * Raw data files loaded, ref by filename.
	 * @param {object.<string,json>} loads
	 * @returns {Object.<string,object[]>} - source file to item list.
	 */
	datasLoaded( loads ) {

		let templates = {};

		// easiest to preparse modules so templates can be assigned in one place.
		for( let p in loads ) {

			var fileData = loads[p];
			if ( fileData === null || fileData === undefined ) {
				console.warn( 'Missing Data for: ' + p );
				loads[p] = [];
			} else if ( fileData.module) {

				this.mergeModule( fileData, loads );
				loads[p] = undefined;
			}

		}

		for( let p in loads ) {

			var itemList = loads[p];
			if ( !itemList ) continue;

			for( let j = itemList.length-1; j >= 0; j-- ) {

				// copy every data item into a template.
				templates[ itemList[j].id ] = ( itemList[j] );

			}

		}

		this.templates = freezeData( templates );
		//for( let p in this.templates ) console.log('template: ' + p );

		return loads;

	},

	/**
	 *
	 * @param {object} mod
	 * @param {object.<string,object>} dataLists - data lists by load file.
	 */
	mergeModule( mod, dataLists ){

		if ( mod.data ) {

			let sym = mod.sym;
			for( let p in mod.data ) {

				var newData = mod.data[p];
				if ( !newData ) continue;

				var targList = dataLists[p];
				if ( targList ) this.mergeData( newData, targList, sym );
				else {
					dataLists[p] = newData;
					if ( sym ) newData.forEach(d=>d.sym = d.sym||sym )
				}

			}

		}

	},

	/**
	 * Merge items from a module data list into the appropriate target list.
	 * @param {object[]} list
	 * @param {object} dest
	 * @param {string} sym - special unicode symbol.
	 */
	mergeData( list, dest, sym ) {

		for( let i = list.length-1; i >= 0; i-- ) {

			var d = list[i];
			if ( !d.id ){
				console.warn('missing id: ' + d.name );
				continue;
			}

			if ( sym ) d.sym = d.sym || sym;

			//console.log('pushing: ' + d.id );
			if ( !Array.isArray(dest)) console.warn( 'DEST NOT AN ARRAY: ' + p );
			dest.push(d);


		}

	},

	/**
	 * At this point dataLists and templates both refer to the same data.
	 * dataLists just have it separated by type.
	 * @param {*} templates
	 * @param {*} dataLists
	 * @param {*} saveData
	 */
	instance( templates, dataLists, saveData={} ){

		saveData = saveData || {};

		// restore Percent/Range classes /special functions of non-item data.
		for( let p in saveData ) {

			// items prepped separately for complex ordering reasons.
			if ( p === 'items') continue;
			saveData[p] = prepData( saveData[p] );

		}
		saveData.items = this.mergeItems( saveData.items, templates );

		let gameLists = this.buildLists( saveData.items, dataLists );

		return this.initInstance( saveData, gameLists );

	},

	/**
	 * Use prepped item data to form data lists matching the
	 * datalists from the raw data files.
	 * @param {.<string,object>} items
	 * @param {.<string,object[]>} dataLists
	 * @returns {.<string,object[]>} lists of items matching lists of loaded data.
	 */
	buildLists( items, dataLists ){

		let gameLists = {};

		for( let p in dataLists ) {

			var dataList = dataLists[p];
			// possibly missing file or empty list.
			if ( !dataList ) continue;

			// lists of game-item data by type.
			var gameList = gameLists[p] = [];

			for( let i = 0; i < dataList.length; i++ ) {
				gameList[i] = items[ dataList[i].id ];
			}

		}

		return gameLists;

	},

	/**
	 *
	 * @param {?Object} saveItems - previous save items.
	 * @param {.<string,Object>} templates - template items..
	 * @returns {.<string,Object>} - the saveItems with data merged from default data.
	 */
	mergeItems( saveItems, templates ) {

		if (!saveItems) saveItems = {};

		/**
		 * @note ordering.
		 * 1) raw template merged over raw save.
		 * 2) data prepared with type instances.
		 * 3) template assigned LAST because the template is frozen and can't be prepped.
		 */
		for( let p in templates ) {

			var saveObj = saveItems[p] || {};

			mergeSafe( saveObj, templates[p] );

			saveItems[p] = prepData( saveObj );
			saveObj.template = templates[p];

		}

		return saveItems;

	},

	initInstance( inst, lists ){

		var items = inst.items;

		if ( lists.resources) inst.resources = this.initItems( items, lists['resources'], Resource );

		if ( lists.stressors ) {
			inst.stressors = this.initItems( items, lists['stressors'], Resource, 'stress', 'stress' );
			inst.stressors.forEach(v=>v.hidden=true);
		}

		if ( lists.upgrades ) inst.upgrades = this.initItems( items, lists['upgrades'], GData, null, 'upgrade' );

		if ( lists.homes ) {
			inst.homes = this.initItems( items, lists['homes'], GData, 'home', 'home' );
			inst.homes.forEach( v=>v.slot='home');
		}

		if ( lists.furniture ) this.initItems( items, lists['furniture'], GData, 'furniture', 'furniture' );

		if ( lists.skills ) inst.skills = this.initItems( items, lists['skills'], Skill, 'skill' );

		if ( lists.encounters ) inst.encounters = this.initItems( items, lists['encounters'], Encounter, ENCOUNTER, ENCOUNTER);
		if ( lists.monsters ) inst.monsters = this.initItems( items, lists['monsters'], Monster, 'monster', 'monster' );

		if ( lists.locales ) this.initItems( items, lists['locales'], Locale );
		if ( lists.dungeons ) this.initItems( items, lists['dungeons'], Dungeon );
		if ( lists.spells ) this.initItems( items, lists['spells'], Spell );

		this.initItems( items, lists['items'], Item, 'item', 'item');

		if ( lists.armors ) {
			inst.armors = this.initItems( items, lists['armors'], ProtoItem, 'armor','armor' );
			inst.armors.forEach( v=>v.kind = v.kind || 'armor' );
		}

		if ( lists.weapons ) {
			inst.weapons = this.initItems( items, lists['weapons'], ProtoItem, 'weapon', 'weapon' );
			inst.weapons.forEach(v=>v.kind=v.kind ||'weapon');
		}

		if ( lists.potions ) inst.potions = this.initItems( items, lists['potions'], Potion, 'potion', 'potion' );

		if ( lists.materials ) inst.materials = this.initItems( items, lists['materials'], Material, 'material', 'material ');

		if ( lists.events ) inst.events = this.initItems( items, lists['events'], GEvent, 'event', 'event' );
		if ( lists.classes ) inst.classes = this.initItems( items, lists['classes'], GClass, 'class', 'class' );

		if ( lists.actions ) inst.actions = this.initItems( items, lists['actions'], Action, null, 'action' );

		if ( lists.enchants ) inst.enchants =this.initItems( items, lists['enchants'], Enchant, null, 'enchant' );
		if ( lists.sections ) inst.sections = this.initItems( items, lists['sections']);

		if ( lists.player ) inst.player = this.initPlayer( items, lists['player'], inst.items.player );

		return inst;

	},

	initItems( items, dataList, UseClass=GData, tag=null, type=null ) {

		if (!dataList ) return undefined;

		for( let i = dataList.length-1; i >= 0; i-- ) {

			var def = dataList[i];

			if ( def.reverse) dataList[i] = def = new RevStat(def);
			else if ( def.zerosum ) dataList[i] = def = new ZeroSum(def);
			else dataList[i] = def = new UseClass( def );

			if ( tag ) def.addTag( tag );
			if ( type ) def.type = type;

			items[def.id] = def;

		}

		return dataList;

	},

	/**
	 *
	 * @param {*} stats - player stats from json.
	 * @param {Object} savePlayer - player data from previous save.
	 */
	initPlayer( items, stats, savePlayer=null ) {

		if ( !stats ) return undefined;

		let vars = savePlayer || {};

		let res;
		for( let def of stats ) {

			res = vars[ def.id ] = def.zerosum === true ? new ZeroSum(def) :
				( def.stat === true ? new StatData(def) :
				( def.reverse === true ? new RevStat(def) : new Resource( def ) )
			);
			items[def.id] = res;

		}

		return new Player( vars );

	},

}

/**
 * Recursive freezing of an object template.
 * Clones must be made to make any changes.
 * @param {*} obj
 */
export const freezeData = ( obj ) => {

	let sub;
	for( let p in obj ){

		sub = obj[p];
		if ( typeof sub === 'object') this.freezeData(sub);
		else Object.freeze( sub );

	}

	return Object.freeze( obj );

}

export const prepData = ( sub ) => {

	if (Array.isArray(sub) ) {

		for( let i = sub.length-1; i >= 0; i-- ) sub[i] = prepData( sub[i] );

	} else if ( sub instanceof Object ) {

		for( let p in sub ) {

			if ( p === 'mod') {

				sub[p] = ParseMods( sub[p], sub.id );
				continue;
			} else if ( p === 'require' || p === 'need' ) {

				sub[p] = parseRequire( sub[p] );

				continue;
			}

			var obj = sub[p];
			if ( typeof obj === 'string' ){

				if ( PercentTest.test(obj) ) {

					sub[p] = new Percent(obj);

				} else if ( RangeTest.test(obj) ) sub[p] = new Range(obj);
				else if ( !isNaN(obj) ) {
					if ( obj !== null && obj !== undefined && obj !== '' ) console.warn('string used as Number: ' + p + ' -> ' + obj );
					//console.warn('store numeric data as number.');
					//sub[p] = Number(obj);
				}
				else if ( p === 'damage' || p === 'dmg') sub[p] = makeDmgFunc(obj);

			} else if ( typeof obj === 'object' ) prepData(obj);

			if ( p.includes('.')) splitKeyPath( sub, p );

		}

	} else if ( typeof sub === 'string') {

		if ( RangeTest.test(sub) ) return new Range(sub);
		else if ( PercentTest.test(sub)) return new Percent(sub);

	}

	return sub;

}

/**
 * Parse a requirement-type object.
 * currently: 'require' or 'need'
 */
export function parseRequire( sub ){

	// REQUIRE
	if ( sub === null || sub === undefined || sub === false || sub === '') return undefined;
	if ( Array.isArray(sub) ) {

		for( let i = sub.length-1; i>= 0; i-- )sub[i] = parseRequire( sub[i] );

	} else if ( typeof sub === 'string' && !IdTest.test(sub )) return makeTestFunc( sub );

	return sub;

}

/**
 * Create a testing function that accepts when
 * the level of the given data item exceeds the level
 * of the item to be unlocked.
 * @todo: doesn't work. unlock test too abstract to detect in code.
 * @param {string} unlocker - name of item that unlocks the item.
 * @returns {function}
 */
export function levelTestFunc( unlocker ) {
	return (g,i)=>{
		g[unlocker].level >= i.level; };
}

/**
 * Create a boolean testing function from a data string.
 * @param {string} text - function text.
 */
export function makeTestFunc( text ) {

	return new Function( "g", 'i', 's', 'return ' + text );
}

/**
 * Create a function which performs an arbitrary effect.
 * player and target params are given for simplicity.
 * target is the current enemy, if any.
 * dt is the elapsed time.
 * @param {*} text
 */
export function makeEffectFunc( text ) {
	return new Function( 'g', 't', 'dt', text );
}

/**
 * Create a damage-value function for an attack.
 * @param {*} text
 */
export function makeDmgFunc(text){
	return new Function( 'state', 'player', 'target', 'return ' + text );
}