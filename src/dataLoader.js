import ResourceList from '../data/resources.json';
import UpgradeList from '../data/upgrades.json';
import ActionList from '../data/actions.json';
import VarPath, {IsVarPath} from 'varPath';

/**
 * @const {RegEx} IdTest - Test for a simple id name.
 */
const IdTest = /^[A-Za-z_]+\w*$/;

/**
 * @todo replace with server call.
 */
export default {

	resourceList:ResourceList,
	upgradeList:UpgradeList,
	actionList:ActionList,

	items:null,

	init(){

		this.items = {};

		this.initItems( ResourceList );
		this.initItems( UpgradeList );
		this.initItems( ActionList );
	
		//this.initResources();
		//this.initUpgrades();
		//this.initActions();

	},

	initItems( arr ) {

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

	initResources() {

		for( let res of ResourceList ) {
			this.items[res.id] = res;
		}

	},

	initUpgrades() {

		for( let up of UpgradeList ) {
			this.items[up.id] = up;
		}

	},

	initActions() {

		for( let act of ActionList) {
			this.items[act.id] = act;
		}

	}

}