import ResourceList from '../data/resources.json';
import UpgradeList from '../data/upgrades.json';
import ActionList from '../data/actions.json';

export default {

	resourceList:ResourceList,
	upgradeList:UpgradeList,
	actionList:ActionList,

	items:null,

	init(){

		this.items = {};

		this.initResources();
		this.initUpgrades();
		this.initActions();

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