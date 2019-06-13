import ResourceList from '../data/resources.json';
import UpgradeList from '../data/upgrades.json';
import ActionList from '../data/actions.json';

/**
 * @const {RegEx} IdTest - Test for a simple id name.
 */
const IdTest = /^\w(?:\w|\d|_)*$/;

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

			var require = it.require;
			if ( require ) {

				if ( typeof require === 'string' && !IdTest.test(require )) it.require = this.createFunc( require );

			}

		}

	},

	initRequires() {
	},

	/**
	 * Create a state function from a data string.
	 * @param {string} text - function text.
	 */
	createFunc( text ) {
		return new Function( "state", text );
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