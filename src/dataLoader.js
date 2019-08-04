import Item from 'items/item';
import Player from './chars/player';

import Wearable from './items/wearable';
import Range, {RangeTest} from './range';
import Percent, {PercentTest} from './percent';

import Resource from './items/resource';
import Skill from './items/skill';
import Monster from './items/monster';

import VarPath  from 'varPath';
import Dungeon from './items/dungeon.js';
import Spell from './items/spell.js';
import Action from './items/action';

import { merge } from 'objecty';

const DataDir = './data/';
const DataFiles = [ 'resources', 'upgrades', 'actions', 'homes', 'furniture', 'skills',
	'player', 'spells', 'monsters', 'dungeons', 'events', 'classes', 'armors', 'weapons',
	'materials', 'sections' ];

/**
 * @const {RegEx} IdTest - Test for a simple id name.
 */
const IdTest = /^[A-Za-z_]+\w*$/;

/**
 * @todo replace with server call.
 */
export default {

	loadData( saveData=null ) {

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

		).then( datas=>this.dataLoaded(datas, saveData),
			err=>{ console.error(err); });

	},

	/**
	 * 
	 * @param {Object[][]} datas - array of Object lists of each type. 
	 * @param {?Object} [gameData=null] - complete previous save data, if any.
	 */
	dataLoaded( datas, gameData=null ) {

		let mergedFiles = {};

		// id => item data only.
		let saveItems = gameData ? gameData.items : null;

		if ( gameData ) {

			// restore Percent/Range classes /special functions of non-item data.
			for( let p in gameData ) {

				if ( p === 'items') continue;
				var dataItem = gameData[p];
				//console.log('game save item: ' + p );
				gameData[p] = this.parseSub(dataItem);

			}

		}

		for( let i = datas.length-1; i >= 0; i-- ) {

			this.initJSON( datas[i], saveItems );

			// map of DataFile name -> data list.
			mergedFiles[ DataFiles[i] ] = datas[i];

		}

		return this.initGameData( mergedFiles, gameData );

	},

	initGameData( dataFiles, saveState=null ){

		var gd = {
			items:{},
		};
		if ( saveState ) Object.assign( gd, saveState );
		
		this.items = gd.items;

		gd.resources = this.initItems( dataFiles['resources'], Resource );

		gd.upgrades = this.initItems( dataFiles['upgrades'], undefined, null, 'upgrade' );
		gd.homes = this.initItems( dataFiles['homes'], undefined, 'home', 'home' );
		this.initItems( dataFiles['furniture'], undefined, 'furniture', 'furniture' );
		this.initItems( dataFiles['skills'], Skill );
		this.initItems( dataFiles['dungeons'], Dungeon );
		this.initItems( dataFiles['spells'], Spell );

		this.initItems( dataFiles['monsters'], Monster, 'monster', 'monster' );

		gd.armors = this.initItems( dataFiles['armors'], Wearable );
		gd.armors.forEach( v=>v.kind = 'armor' );
	
		gd.weapons = this.initItems( dataFiles['weapons'], Wearable );
		gd.weapons.forEach(v=>v.kind='weapon');

		gd.materials = dataFiles['materials'];

		gd.events = this.initItems( dataFiles['events'], undefined, null, 'event' );
		gd.events = gd.events.concat( this.initItems( dataFiles['classes'], undefined, null, 'event') );

		gd.actions = this.initItems( dataFiles['actions'], Action, null, 'action' );
		gd.actions.forEach( v=>v.repeat = (v.repeat!==undefined ) ? v.repeat : true );

		gd.sections = this.initItems( dataFiles['sections']);
		
		gd.player = this.items.player = this.initPlayer( dataFiles['player'], gd.items.player );

		return gd;

	},

	initJSON( arr, saveItems=null ) {

		if ( saveItems ) {

			for( let it of arr ) {

				var saveObj = saveItems[it.id];
				//console.log('MERGING: ' + it.id );
				if ( saveObj ) merge( it, saveObj );

			}

		}

		for( let it of arr ) {
			//console.log('parsing sub: ' + it.id );
			this.parseSub(it);
		}

	},

	parseSub( sub ) {

		if ( sub instanceof Array ) {

			for( let i = sub.length-1; i >= 0; i-- ) sub[i] = this.parseSub( sub[i] );

		} else if ( sub instanceof Object ) {

			for( let p in sub ) {
	
				var obj = sub[p];
				var type = typeof obj;
				if ( type === 'string' ){

					//console.log('parse string: ' + p + ' --> ' + obj );
					if ( p === 'require' || p === 'need') sub[p] = this.parseRequire( obj );
					else if ( PercentTest.test(obj) ) sub[p] = new Percent(obj);
					else if ( RangeTest.test(obj) ) sub[p] = new Range(obj);
					else if ( !isNaN(obj) ) {
						console.warn('string used as Number: ' + p + ' -> ' + obj );
						//console.warn('store numeric data as number.');
						//sub[p] = Number(obj);
					}
					else if ( p === 'damage' || p === 'dmg') sub[p] = this.makeDmgFunc(obj);

				} else if ( type === 'object' ) this.parseSub(obj);

				// convert to an assignment object.
				if ( p.includes('.')) {
					this.splitKeyPath( sub, p );
					//var a = new Assign( p, mod[p] );
					//mod[ a.parts[0] ] = a;
				}

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
		if ( typeof sub === 'string' && !IdTest.test(sub )) return this.makeTestFunc( sub );
		else return this.parseSub( sub );

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

	initItems( DataList, UseClass=Item, tag=null, type=null ) {

		let a = [];
		let cnstr = UseClass ? UseClass.prototype.constructor : null;

		let it;
		for( let def of DataList ) {

			it = new cnstr( def );
			if ( tag ) it.addTag( tag );
			if ( type ) it.type = type;

			a.push(it);
			this.items[it.id] = it;

		}

		return a;

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

		let parts = prop.split('.');

		let max = parts.length-1;

		// stops before length-1 since last assign goes to val.
		for( let i = 0; i < max; i++ ) {
			obj = obj[ parts[i] ] = {};
		}

		obj[ parts[max] ] = val;

	}

}