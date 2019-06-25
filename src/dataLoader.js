import ResourceList from '../data/resources.json';
import UpgradeList from '../data/upgrades.json';
import ActionList from '../data/actions.json';
import HomeList from '../data/homes.json';
import SkillList from '../data/skills.json';
import EventList from '../data/events.json';

import Assign from './assignPath';
import Item from 'items/item';
import Resource from 'items/resource';
import Upgrade from 'items/upgrade';
import Action from 'items/action';
import Skill from 'items/skill';

import VarPath, {IsVarPath} from 'varPath';

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

		this.initGameItems();

	},

	initJSON( arr ) {

		for( let it of arr ) {

			var sub = it.require;
			if ( sub ) {

				// REQUIRE
				if ( typeof sub === 'string' && !IdTest.test(sub )) it.require = this.createTest( sub );

			}
			sub = it.mod;
			if ( sub ) {
				it.mod = this.parseMods(sub);
			}

		}

	},

	parseMods( mod ) {

		if ( mod instanceof Array ) return mod.map( this.parseMods, this );

		if ( mod instanceof Object ) {

			for( let p in mod ) {
	
				// convert to an assignment object.
				if ( p.includes('.')) {
					this.expandPropPath( mod, p );
					//var a = new Assign( p, mod[p] );
					//mod[ a.parts[0] ] = a;
				}

			}

		}
		return mod;

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

		this._items = {};
		var gd = this._gameData = {};

		gd.resources = this.initResources();
		gd.upgrades = this.initUpgrades( UpgradeList );
		gd.homes = this.initUpgrades( HomeList, 'home' );
		gd.skills = this.initSkills( SkillList );

		gd.events = this.initEvents( EventList );

		gd.actions = this.initActions();

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

	initResources(){

		let a = [];
		let res;

		for( let def of ResourceList ) {

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

			act = new Action( def );
			a.push(act);
			this._items[act.id] = act;

		}

		return a;

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
	expandPropPath( obj, prop ) {

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