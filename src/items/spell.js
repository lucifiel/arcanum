import GData from './gdata';

export default class Spell extends GData {

	toJSON(){

		let data = super.toJSON();

		if ( this.owned ) data.owned = this.owned;
		if ( this.timer > 0 ) data.timer = this.timer;

		return data;
	}

	constructor(vars=null) {

		super(vars);

		this.timer = this.timer || 0;

		this.repeat = true;
		this.type = 'spell';
		this.level = this.level || 1;

		this.owned = this.owned || false;
		if ( !this.owned ) {

			if ( !this.buy ) this.buy = {};
			if ( !this.buy.arcana ) this.buy.arcana = this.level;

		}

		if ( !this.require && !this.need && this.locked ) this.require = this.spellRequire;

	}

	/**
	 * Default require function for spells.
	 * @param {GameState} state
	 */
	spellRequire( state, self ) {
		return state.player.level >= self.level;
	}

};