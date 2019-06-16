import ResourceList from '../data/resources.json';
import UpgradeList from '../data/upgrades.json';
import ActionList from '../data/actions.json';
import HomeList from '../data/homes.json';

import Resource from 'resource';
import Upgrade from 'upgrade';
import Action from 'action';

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

		this.initGameItems();

	},

	initJSON( arr, tag=null ) {

		for( let it of arr ) {

			var sub = it.require;
			if ( sub ) {

				// REQUIRE
				if ( typeof sub === 'string' && !IdTest.test(sub )) it.require = this.createTest( sub );

			}
			/*sub = it.mod;
			if ( sub ) {
				it.mod = this.parseMods(sub);
			}*/

		}

	},

	parseMods( mod ) {

		if ( mod instanceof Array ) return mod.map( this.parseMods, this );

		if ( mod instanceof Object ) {

			for( let p in mod ) {

			}

		}

	},

	initRequires() {
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

		gd.actions = this.initActions();

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

	initActions() {

		let a = [];

		let act;
		for( let def of ActionList ) {

			act = new Action( def );
			a.push(act);
			this._items[act.id] = act;

		}

		return a;

	}

}