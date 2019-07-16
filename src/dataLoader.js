import ResourceList from 'data/resources.json';
import UpgradeList from 'data/upgrades.json';
import ActionList from 'data/actions.json';

import HomeList from 'data/homes.json';
import Furniture from 'data/furniture';
import SkillList from 'data/skills.json';

import PlayerStats from 'data/player.json';
import SpellList from 'data/spells.json';

import MonsterList from 'data/monsters';
import Dungeons from 'data/dungeons.json';

import EventList from 'data/events.json';
import ClassList from 'data/classes';

// WEARABLES
import Armors from 'data/equip/armors';
import Weapons from 'data/equip/weapons';
//import Equips from 'data/equip/equip';

import Item from 'items/item';
import Player from './chars/player';

import Wearable from './items/wearable';
import Range, {RangeTest} from './range';
import Resource from './items/resource';
import Upgrade from './items/upgrade';
import Skill from './items/skill';
import Monster from './items/monster';

import VarPath  from 'varPath';
import Dungeon from './items/dungeon.js';
import Spell from './items/spell.js';

/**
 * @const {RegEx} IdTest - Test for a simple id name.
 */
const IdTest = /^[A-Za-z_]+\w*$/;

export { ResourceList, UpgradeList, ActionList, HomeList };

/**
 * @todo replace with server call.
 */
export default {

	/**
	 * @property {} gameData - all game data.
	 */
	get gameData() { return this._gameData; },

	init() {

		this.initJSON( ResourceList );
		this.initJSON( UpgradeList );
		this.initJSON( ActionList );

		this.initJSON( HomeList );
		this.initJSON( Furniture);

		this.initJSON( SkillList );
		this.initJSON( Dungeons );
		this.initJSON( PlayerStats );
		this.initJSON( SpellList );

		this.initJSON( Armors );
		this.initJSON( Weapons );

		this.initJSON( EventList );
		this.initJSON( ClassList);

		this.initJSON( MonsterList );

		this.initGameItems();

	},

	initJSON( arr ) {

		for( let it of arr ) {

			if ( it.require ) this.parseRequire( it, 'require');
			if ( it.need ) this.parseRequire( it, 'need');
	
			if ( it.mod ) it.mod = this.parseSub(it.mod);
			if ( it.fill) it.fill = this.parseSub(it.fill);
			if ( it.effect ) it.effect = this.parseSub(it.effect );
			if ( it.result ) it.result = this.parseSub(it.result);

			if ( it.attack ) this.parseSub( it.attack );

			if ( it.dot) {
				if ( it.dot.effect ) this.parseSub( it.dot.effect );
				if ( it.dot.mod ) this.parseSub( it.dot.mod );
			}

		}

	},

	/**
	 * Parse a requirement-type object.
	 * currently: 'require' or 'need'
	 */
	parseRequire( obj, p='require' ){

		let sub = obj[p];

		// REQUIRE
		if ( typeof sub === 'string' && !IdTest.test(sub )) obj[p] = this.makeTestFunc( sub );
		else obj[p] = this.parseSub( sub );

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
					if ( RangeTest.test(obj) ) sub[p] = new Range(obj);
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

			if ( sub.includes('.') ) return new VarPath( sub );
			else if ( RangeTest.test(sub) ) return new Range(sub);
		}

		return sub;

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
	 * @param {*} text 
	 */
	makeEffectFunc( text ) {
		return new Function( 'state', 'player', 'target', text );
	},

	/**
	 * Create a damage-value function for an attack.
	 * @param {*} text 
	 */
	makeDmgFunc(text){
		return new Function( 'state', 'player', 'target', 'return ' + text );
	},

	/**
	 * Game items as opposed to raw data items.
	 */
	initGameItems() {

		var gd = this._gameData = {
			items:{},

			/**
			 * @property {Object.<string,Item[]>} byTag - items by tag.
			 */
			tagLists:{}
		};
		
		this._items = gd.items;

		gd.resources = this.initItems( ResourceList, Resource );

		gd.upgrades = this.initItems( UpgradeList, Upgrade, null, 'upgrade' );
		gd.homes = this.initItems( HomeList, Upgrade, 'home', 'home' );
		this.initItems( Furniture, Upgrade, 'furniture', 'furniture' );
		this.initItems( SkillList, Skill );
		this.initItems( Dungeons, Dungeon );
		this.initItems( SpellList, Spell );

		this.initItems( MonsterList, Monster, 'monster', 'monster' );

		gd.armors = this.initItems( Armors, Wearable, 'armor' );
		gd.weapons = this.initItems( Weapons, Wearable, 'weapon' );

		gd.events = this.initItems( EventList, Item, null, 'event' );
		gd.events = gd.events.concat( this.initItems( ClassList, Item, null, 'event') );

		gd.actions = this.initItems( ActionList, Item, null, 'action' );
		gd.actions.forEach( v=>v.repeat = (v.repeat!==undefined ) ? v.repeat : true );

		gd.player = this._items.player = this.initPlayer( PlayerStats );

		this.makeLists( gd.tagLists, gd.items );

	},

	/**
	 * Create lists of tagged items.
	 * @param {Object.<string,Item[]>} lists 
	 * @param {Object.<string,Item>} items 
	 */
	makeLists( lists, items ) {


		for( let p in items ) {

			var it = items[p];
			var tags = it.tags;
			if ( !tags ) continue;

			for( var t of tags ){

				var list = lists[t];
				if ( !list ) lists[t] = list = [];
				list.push( it );

			}

		}

	},

	initItems( DataList, UseClass=Item, tag=null, type=null ) {

		let a = [];

		let it;
		for( let def of DataList ) {

			it = new UseClass.prototype.constructor( def );
			if ( tag ) it.addTag( tag );
			if ( type ) it.type = type;

			a.push(it);
			this._items[it.id] = it;

		}

		return a;

	},

	initPlayer( stats ) {

		let vars = {};

		let res;
		for( let def of stats ) {

			res = vars[ def.id ] = new Resource( def );
			this._items[def.id] = res;

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