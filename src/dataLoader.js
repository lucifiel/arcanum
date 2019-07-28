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

const DataDir = './data/';
const DataFiles = [ 'resources', 'upgrades', 'actions', 'homes', 'furniture', 'skills',
	'player', 'spells', 'monsters', 'dungeons', 'events', 'classes', 'armors', 'weapons','sections' ];

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
	 * @param {?Object} [gameData=null] - previous save data, if any.
	 */
	dataLoaded( datas, gameData=null ) {

		let raw = {};

		let saveItems = gameData ? gameData.items : null;

		if ( gameData ) {

			// parse subs into full objects.
			for( let p in gameData ) {

				if ( p === 'items') continue;
				var dataItem = gameData[p];
				gameData[p] = this.parseSub(dataItem);

			}

		}

		for( let i = datas.length-1; i >= 0; i-- ) {

			this.initJSON( datas[i], saveItems );

			raw[ DataFiles[i] ] = datas[i];

		}

		return this.initGameData( raw, gameData );

	},

	initGameData( rawData, saveState=null ){

		var gd = {
			items:{},
		};
		if ( saveState ) Object.assign( gd, saveState );
		
		this.items = gd.items;

		gd.resources = this.initItems( rawData['resources'], Resource );

		gd.upgrades = this.initItems( rawData['upgrades'], undefined, null, 'upgrade' );
		gd.homes = this.initItems( rawData['homes'], undefined, 'home', 'home' );
		this.initItems( rawData['furniture'], undefined, 'furniture', 'furniture' );
		this.initItems( rawData['skills'], Skill );
		this.initItems( rawData['dungeons'], Dungeon );
		this.initItems( rawData['spells'], Spell );

		this.initItems( rawData['monsters'], Monster, 'monster', 'monster' );

		gd.armors = this.initItems( rawData['armors'], Wearable );
		gd.armors.forEach( v=>v.kind = 'armor' );
	
		gd.weapons = this.initItems( rawData['weapons'], Wearable );
		gd.weapons.forEach(v=>v.kind='weapon');

		gd.events = this.initItems( rawData['events'], undefined, null, 'event' );
		gd.events = gd.events.concat( this.initItems( rawData['classes'], undefined, null, 'event') );

		gd.actions = this.initItems( rawData['actions'], Action, null, 'action' );
		gd.actions.forEach( v=>v.repeat = (v.repeat!==undefined ) ? v.repeat : true );

		gd.sections = this.initItems( rawData['sections']);
		
		gd.player = this.items.player = this.initPlayer( rawData['player'], saveState ? saveState.player : null );

		return gd;

	},

	initJSON( arr, saveItems=null ) {

		if ( saveItems ) {

			for( let it of arr ) {

				var saveObj = saveItems[it.id];
				//console.log('MERGING: ' + it.id );
				if ( saveObj ) this.merge( it, saveObj );

			}

		}

		for( let it of arr ) {
			this.parseSub(it);
		}

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

	parseSub( sub ) {

		if ( sub instanceof Array ) {

			for( let i = sub.length-1; i >= 0; i-- ) {
				sub[i] = this.parseSub( sub[i] );
			}

		} else if ( sub instanceof Object ) {

			for( let p in sub ) {
	
				var obj = sub[p];
				var type = typeof obj;
				if ( type === 'string' ){

					//console.log('parse string: ' + p + ' --> ' + obj );
					if ( p === 'require' || p === 'need') sub[p] = this.parseRequire( obj );
					else if ( PercentTest.test(obj) ) sub[p] = new Percent(obj);
					else if ( RangeTest.test(obj) ) sub[p] = new Range(obj);
					else if (!isNaN(obj)) sub[p] = Number(obj);
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
	 * Merge two objects with overwrites from src.
	 * @param {Object} dest 
	 * @param {Object} src 
	 */
	merge( dest, src ) {

		for( let p in src ) {

			var destObj = dest[p];
			var srcObj = src[p];

			var srcType = typeof srcObj;
			if ( !destObj || srcType === 'string' || !isNaN(srcObj) ) {
				dest[p] = srcObj;
				continue;
			}

			var destType = typeof( destObj );
			if ( destType === 'object') this.merge( destObj, srcObj );
			else if ( destType === 'array' ) {

				if ( srcType === 'array') dest[p] = this.mergeArrays( destObj, srcObj );
				else if ( !destObj.includes(srcObj) ) destObj.push(srcObj);

			}


		}

	},

	/**
	 * Merge unique elements of two arrays.
	 * @param {Array} a1 
	 * @param {Array} a2
	 * @returns {Array} 
	 */
	mergeArrays( a1, a2) {
		return a1.concat( a2.filter(v=>!a1.includes(v) ) );
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

		let it;
		for( let def of DataList ) {

			it = new UseClass.prototype.constructor( def );
			if ( tag ) it.addTag( tag );
			if ( type ) it.type = type;

			a.push(it);
			this.items[it.id] = it;

		}

		return a;

	},

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