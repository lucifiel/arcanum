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

import Resource from 'items/resource';
import Upgrade from 'items/upgrade';
import Skill from 'items/skill';

import VarPath, {IsVarPath} from 'varPath';
import Dungeon from './items/dungeon.js';

/**
 * @const {RegEx} IdTest - Test for a simple id name.
 */
const IdTest = /^[A-Za-z_]+\w*$/;

export { ResourceList, UpgradeList, ActionList, HomeList };

/**
 * @todo replace with server call.
 */
export default {

	get items() { return this._items; },
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

			if ( it.dot) {
				if ( it.dot.effect ) this.parseSub( it.dot.effect );
				if ( it.dot.mod ) this.parseSub( it.dot.mod );
			}

		}

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
			items:{}
		};
		
		this._items = gd.items;

		gd.resources = this.initResources( ResourceList );
		gd.upgrades = this.initUpgrades( UpgradeList );
		gd.homes = this.initUpgrades( HomeList, 'home' );
		this.initUpgrades( Furniture, 'furniture' );
	
		gd.skills = this.initSkills( SkillList );

		this.initDungeons( Dungeons );
	
		gd.events = this.initEvents( EventList );

		this.initSpells( SpellList );

		gd.actions = this.initActions();

		gd.player = this._items.player = this.initPlayer( PlayerStats );
	},

	/**
	 * Note: unlike the other init funcs, this returns an Object.
	 * @param {Array} events
	 * @returns {Object.<string,Item>}
	 */
	initEvents( events ) {

		let a = {};

		for( let def of events ){

			def._type = 'event';
			this._items[def.id] = a[def.id] = new Item( def );

		}

		return a;
	},

	initResources( resArr ){

		let a = [];
		let res;

		for( let def of resArr ) {

			res = new Resource( def );
	
			a.push( res );
			this._items[ def.id ] = res;

		}

		return a;

	},

	initUpgrades( DataList, tag ) {

		let a = [];

		let up;
		for( let def of DataList ) {

			up = new Upgrade( def );
			up.addTag( tag );

			a.push(up);
			this._items[up.id] = up;

		}

		return a;

	},
	initSkills( DataList ) {

		let a = [];

		let s;
		for( let def of DataList ) {

			s = new Skill( def );
			//s.addTag( tag );

			a.push(s);
			this._items[s.id] = s;

		}

		return a;

	},

	initActions() {

		let a = [];

		let act;
		for( let def of ActionList ) {

			act = new Item( def );
			act.type = 'action';
			act.repeat = true;

			a.push(act);
			this._items[act.id] = act;

		}

		return a;

	},

	initSpells( spellArr ) {

		let a = [];

		let act;
		for( let def of spellArr ) {

			act = new Item( def );
			act.type = 'spell';
			act.repeat = true;

			a.push(act);
			this._items[act.id] = act;

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

	initDungeons( list ) {

		let d;
		for( let def of list ) {

			d = new Dungeon( def );
			this._items[d.id] = d;

		}

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