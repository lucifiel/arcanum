import Item from './item';

export default class Spell extends Item {

	toJSON(){

		let data = super.toJSON();
		data.learned = this.learned;
		data.cast = (this.cast);
		// cost already encoded.

		if ( this.timer > 0 ) data.timer = this.timer;

		return data;
	}

	constructor(vars=null) {

		super(vars);

		this.timer = this.timer || 0;

		this.repeat = true;
		this.type = 'spell';
		this.level = this.level || 1;

		this.learned = this.learned || false;
		if ( !this.learned ) {
			if ( !this.cost ) this.cost = {};
			if ( !this.cost.arcana ) this.cost.arcana = this.level;
		} else {

			this.cost = this.cast;
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