import ResourceList from 'data/resources.json';
import UpgradeList from 'data/upgrades.json';
import ActionList from 'data/actions.json';
import HomeList from 'data/homes.json';
import SkillList from 'data/skills.json';
import EventList from 'data/events.json';
import Dungeons from 'data/dungeons.json';
import PlayerStats from 'data/player.json';
import SpellList from 'data/spells.json';
import Furniture from 'data/furniture';

import Item from 'items/item';
import Player from 'player';

import Range from 'range';
import Resource from 'items/resource';
import Upgrade from 'items/upgrade';
import Skill from 'items/skill';

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
		this.initJSON( SkillList );
		this.initJSON ( Dungeons );
		this.initJSON( PlayerStats );
		this.initJSON( SpellList );
		this.initJSON( Furniture);
		this.initJSON( EventList );

		this.initGameItems();

	},

	initJSON( arr ) {

		for( let it of arr ) {

			var sub = it.require;
			if ( sub ) {

				// REQUIRE
				if ( typeof sub === 'string' && !IdTest.test(sub )) it.require = this.createTest( sub );

			}
	
			if ( it.mod ) it.mod = this.parseSub(it.mod);
			if ( it.fill) it.fill = this.parseSub(it.fill);
			if ( it.effect ) it.effect = this.parseSub(it.effect );
			if ( it.result ) it.result = this.parseSub(it.result);

			if ( it.attack )this.parseAttack( it.attack );

			if ( it.dot) {
				if ( it.dot.effect ) this.parseSub( it.dot.effect );
				if ( it.dot.mod ) this.parseSub( it.dot.mod );
			}

		}

	},

	parseAttack( atk ) {

		if ( atk.damage ) atk.damage = new Range( atk.damage );
	},

	parseSub( sub ) {

		if ( sub instanceof Array ) {

			for( let i = sub.length-1; i >= 0; i-- ) {
				sub[i] = this.parseSub( sub[i] );
			}

		} else if ( sub instanceof Object ) {

			for( let p in sub ) {
	
				// convert to an assignment object.
				if ( p.includes('.')) {
					this.splitKeyPath( sub, p );
					//var a = new Assign( p, mod[p] );
					//mod[ a.parts[0] ] = a;
				}

			}

		} else if ( typeof sub === 'string') {

			if ( sub.includes('.') ) return new VarPath( sub );
		}

		return sub;

	},

	/**
	 * Create a boolean testing function from a data string.
	 * @param {string} text - function text.
	 */
	createTest( text ) {
		return new Function( "state", 'return ' + text );
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
	
		gd.events = this.initItems( EventList, Item, null, 'event' );

		gd.actions = this.initItems( ActionList, Item, null, 'action' );
		gd.actions.forEach( v=>v.repeat= v.repeat!==undefined ? true : v.repeat );

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

			it = new UseClass( def );
			if ( tag !== null ) it.addTag( tag );
			if ( type !== null ) it.type = type;

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