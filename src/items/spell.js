import Item from './item';

export default class Spell extends Item {

	constructor(vars=null) {

		super(vars);

		this.repeat = true;
		this.type = 'spell';
		this.level = this.level || 1;
		if ( !this.cost ) this.cost = {};
		if ( !this.cost.arcana ) this.cost.arcana = this.level;

		if ( !this.require && !this.need && this.locked ) this.require = this.defaultRequire;

		this.learned = this.learned || false;

	}

	defaultRequire( state, self ) {
		return state.player.level >= self.level;
	}

};