import DataLoader from 'dataLoader';
import Resource from 'resource';
import Log from 'log';

export default {

	get gameData() { return this._gameData; },
	set gameData(v) { this._gameData =v;},

	init() {

		DataLoader.init();

		this.initGameData();

	},

	/**
	 * 
	 * @param {string} id
	 * @returns {Resource} 
	 */
	getStat( id ) {
		return this.statsById[id];
	},

	initGameData() {

		let data = {};

		let statsById = {};
		let stats = [];
		let stat;

		for( let def of DataLoader.resourceList ) {

			stat = new Resource();
			stat.type = def;
	
			stat.rate = 0.1;
	
			stats.push( stat );
			statsById[ def.id ] = stat;

			//data[def.id] = stat;


		}

		data.stats = stats;

		this.statsById = statsById;
		this._gameData = data;
	}

}