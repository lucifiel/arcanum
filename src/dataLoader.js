import Item from 'items/item';
import Player from './chars/player';

import Range, {RangeTest} from './range';
import Percent, {PercentTest} from './percent';
import Mod, {ModTest} from './mod';

import Resource from './items/resource';
import Skill from './items/skill';
import Monster from './items/monster';

import VarPath  from './varPath';
import Dungeon from './items/dungeon.js';
import Spell from './items/spell.js';
import Action from './items/action';

import { mergeSafe } from 'objecty';
import ZeroSum from './items/zerosum';
import ProtoItem from './items/protoItem';
import Material from './chars/material';

const DataDir = './data/';
const DataFiles = [ 'resources', 'upgrades', 'actions', 'homes', 'furniture', 'skills',
	'player', 'spells', 'monsters', 'dungeons', 'events', 'classes', 'armors', 'weapons',
	'materials', 'enchants', 'sections' ];

/**
 * @const {RegEx} IdTest - Test for a simple id name.
 */
const IdTest = /^[A-Za-z_]+\w*$/;

/**
 * @todo replace with server call.
 */
export default {

	/**
	 * @property {Object.<string,Object>} templates - default Item templates.
	 * item id => default item data.
	 */
	templates:null,

	/**
	 * Lists of item ids for each item type.
	 * itemType => item id list
	 * @property {Object.<string,string[]>}
	 */
	itemLists:null,

	async loadGame( saveData ) {

		if ( this.templates === null ) {

			return this.loadData().then(()=>{
				return this.makeGameData( this.templates, this.itemLists, saveData );
			});

		} else return this.makeGameData( this.templates, this.itemLists, saveData );

	},

	loadData() {

		let headers = new Headers();
		headers.append( 'Content-Type', 'text/json');
		return Promise.all(

			DataFiles.map(
				v=>window.fetch( DataDir + v + '.json', {

					method:'GET',
					headers:headers,
					mode:'cors',
					credentials:'same-origin'
				}).then( r=>{

					if ( r.status !== 200 ) return null;
					return r.json();
				})

			)

		).then( arr=>this.filesLoaded(arr),
			err=>{ console.error(err); });

	},

	/**
	 * Raw data files loaded.
	 * @param {Object[][]} filesArr
	 */
	filesLoaded( filesArr ) {

		let templates = {};

		let lists = {};
		let itemList;

		for( let i = filesArr.length-1; i>=0; i-- ) {

			lists[ DataFiles[i] ] = itemList = filesArr[i];
			//console.log('Setting Default List: ' + DataFiles[i] );

			for( let j = itemList.length-1; j >= 0; j-- ) {

				// copy every list item as a template.
				templates[ itemList[j].id ] = ( itemList[j] );
				// transform to list of ids.
				itemList[j] = itemList[j].id;

			}

		}

		this.templates = this.freezeData( templates );
		//for( let p in this.templates ) console.log('template: ' + p );

		this.itemLists = lists;

	},

	makeGameData( templates, itemLists, saveData={} ){

		saveData = saveData || {};

		// restore Percent/Range classes /special functions of non-item data.
		for( let p in saveData ) {

			if ( p === 'items') continue;
			var dataItem = saveData[p];
			//console.log('game save item: ' + p );
			saveData[p] = this.parseSub(dataItem);

		}

		saveData.items = this.mergeDefaults( templates, saveData.items );

		/**
		 * Form the actual item lists used as the gameData.
		 */
		let gameLists = {};

		var idList, gameList;
		for( let p in itemLists ) {

			idList = itemLists[p];

			//console.log('CREATING LIST TYPE: ' + p );
			// lists of game-item data by type.
			gameLists[p] = gameList = [];

			for( let i = 0; i < idList.length; i++ ) {
				// copy actual game data into game list.
				//console.log('Adding ' + idList[i] + ' Item: ' + saveData.items[ idList[i] ] );
				gameList[i] = saveData.items[ idList[i] ];
			}


		}

		return this.initGameData( saveData, gameLists );

	},

	/**
	 *
	 * @param {Object.<string,Object>} templates - template items.
	 * @param {?Object} [saveItems={}] - previous save items, if any.
	 * @returns {Object.<string,Object>} - the saveItems with data merged from default data.
	 */
	mergeDefaults( templates, saveItems={} ) {

		//console.log('Merging Template Data');

		// NOTE: This requires that properties are never actually deleted from items,
		// though they can be set to null.
		for( let p in templates ) {

			//console.log('MERGING: ' + p );

			var saveObj = saveItems[p] || {};

			mergeSafe( saveObj, templates[p] );

			saveItems[p] = this.parseSub( saveObj );
			saveObj.template = templates[p];

		}

		return saveItems;

	},

	initGameData( gd, dataLists ){

		this.items = gd.items;

		gd.resources = this.initItems( dataLists['resources'], Resource );

		gd.upgrades = this.initItems( dataLists['upgrades'], Item, null, 'upgrade' );

		gd.homes = this.initItems( dataLists['homes'], Item, 'home', 'home' );
		gd.homes.forEach( v=>v.slot='home');

		this.initItems( dataLists['furniture'], Item, 'furniture', 'furniture' );
		this.initItems( dataLists['skills'], Skill );

		gd.monsters = this.initItems( dataLists['monsters'], Monster, 'monster', 'monster' );
		this.initItems( dataLists['dungeons'], Dungeon );
		this.initItems( dataLists['spells'], Spell );

		gd.armors = this.initItems( dataLists['armors'], ProtoItem );
		gd.armors.forEach( v=>v.kind = 'armor' );

		gd.weapons = this.initItems( dataLists['weapons'], ProtoItem );
		gd.weapons.forEach(v=>v.kind='weapon');

		gd.materials = this.initItems( dataLists['materials'], Material, 'material', 'material ');

		gd.events = this.initItems( dataLists['events'], Item, null, 'event' );
		gd.classes = this.initItems( dataLists['classes'], Item, 'class', 'class' );

		gd.actions = this.initItems( dataLists['actions'], Action, null, 'action' );
		gd.actions.forEach( v=>v.repeat = (v.repeat!==undefined ) ? v.repeat : true );

		gd.sections = this.initItems( dataLists['sections']);

		gd.player = this.items.player = this.initPlayer( dataLists['player'], gd.items.player );

		return gd;

	},

	parseSub( sub ) {

		if (Array.isArray(sub) ) {

			for( let i = sub.length-1; i >= 0; i-- ) sub[i] = this.parseSub( sub[i] );

		} else if ( sub instanceof Object ) {

			for( let p in sub ) {

				if ( p === 'mod') {
					sub[p] = this.parseMods( sub[p], sub.id );
					continue;
				}

				var obj = sub[p];
				var type = typeof obj;
				if ( type === 'string' ){

					if ( p === 'require' || p === 'need') {
						sub[p] = this.parseRequire( sub[p] );
					}

					if ( PercentTest.test(obj) ) sub[p] = new Percent(obj);
					else if ( RangeTest.test(obj) ) sub[p] = new Range(obj);
					else if ( !isNaN(obj) ) {
						if ( obj !== null && obj !== undefined && obj !== '' ) console.warn('string used as Number: ' + p + ' -> ' + obj );
						//console.warn('store numeric data as number.');
						//sub[p] = Number(obj);
					}
					else if ( p === 'damage' || p === 'dmg') sub[p] = this.makeDmgFunc(obj);

				} else if ( type === 'object' ) this.parseSub(obj);

				if ( p.includes('.')) this.splitKeyPath( sub, p );

			}

		} else if ( typeof sub === 'string') {

			if ( RangeTest.test(sub) ) return new Range(sub);
			else if ( PercentTest.test(sub)) return new Percent(sub);
			else if ( sub.includes('.') ) return new VarPath( sub );

		}

		return sub;

	},

	/**
	 * Parse a requirement-type object.
	 * currently: 'require' or 'need'
	 */
	parseRequire( sub ){

		// REQUIRE
		if ( sub === null || sub === undefined || sub === false || sub === '') return null;
		if ( typeof sub === 'string' && !IdTest.test(sub )) return this.makeTestFunc( sub );
		else return this.parseSub( sub );

	},

	parseMods( mods, id ) {

		for( let s in mods ){
			if ( s.includes('.')) this.splitKeyPath( mods, s );
		}

		for( let s in mods ) {

			var val = mods[s];
			var typ = typeof val;
			if ( typ === 'number' || (typ === 'string' && ModTest.test(val)) ) {

					val = mods[s] = new Mod(val, id);

			} else if ( val instanceof Mod ) continue;
			else if ( typ === 'object') this.parseMods( val, id );

		}
		return mods;

	},

	/**
	 * Create a boolean testing function from a data string.
	 * @param {string} text - function text.
	 */
	makeTestFunc( text ) {
		return new Function( "state", 'return ' + text );
	},

	/**
	 * Create a function which performs an arbitrary effect.
	 * player and target params are given for simplicity.
	 * target is the current enemy, if any.
	 * dt is the elapsed time.
	 * @param {*} text
	 */
	makeEffectFunc( text ) {
		return new Function( 'state', 'target', 'dt', text );
	},

	/**
	 * Create a damage-value function for an attack.
	 * @param {*} text
	 */
	makeDmgFunc(text){
		return new Function( 'state', 'player', 'target', 'return ' + text );
	},

	initItems( dataList, UseClass=Item, tag=null, type=null ) {

		for( let i = dataList.length-1; i >= 0; i-- ) {

			var def = dataList[i];

			dataList[i] = def = def.zerosum === true ? new ZeroSum(def) : new UseClass( def );
			if ( tag ) def.addTag( tag );
			if ( type ) def.type = type;

			this.items[def.id] = def;

		}

		return dataList;

	},

	/**
	 *
	 * @param {*} stats - player stats from json.
	 * @param {Object} savePlayer - player data from previous save.
	 */
	initPlayer( stats, savePlayer=null ) {

		let vars = savePlayer || {};

		let res;
		for( let def of stats ) {

			res = vars[ def.id ] = new Resource( def );
			this.items[def.id] = res;

		}

		return new Player( vars );

	},

	/**
	 * For an object variable path key, the key is expanded
	 * into subojects, each with a single property of the next
	 * part of the variable path.
	 * This is done to allow object props to represent variable paths
	 * without changing all the code to use Maps (with VarPath keys) and not Objects.
	 * @param {Object} obj
	 * @param {string} prop
	 */
	splitKeyPath( obj, prop ) {

		let val = obj[prop];
		delete obj[prop];

		let keys = prop.split('.');

		let max = keys.length-1;

		// stops before length-1 since last assign goes to val.
		for( let i = 0; i < max; i++ ) {

			obj = obj[ keys[i] ] = typeof obj[ [keys[i]]] === 'object' ? obj[ keys[i] ] : {};

		}

		obj[ keys[max] ] = val;

	},

	/**
	 * Freeze all template data.
	 * Clones must be made for any new edits.
	 */
	freezeData( obj ) {

		let sub;
		for( let p in obj ){

			sub = obj[p];
			if ( typeof sub === 'object') this.freezeData(sub);
			else Object.freeze( sub );

		}

		return Object.freeze( obj );

	}

}