import Item from './item';
import Game from '../game';

export default class Action extends Item {

	valueOf(){
		return this.locked ? 0 : this._value;
	}
	
	get level() {return this._value;}
	set level(v) { this._value =v;}

	/**
	 * @property {number} exp - alias progress for clarity
	 * in data files.
	 */
	get exp() { return this._exp || 0; }
	set exp(v){ this._exp =v; }

	get length() { return this._length; }
	set length(v) { this._length = v;}

	get progress() { return this._exp; }
	set progress(v){
		this._exp = v;
		if ( this.length && v >= this._length ) {
			this.value++;
			this._exp -= this._length;
			if ( this.complete ) this.complete();
			if ( this.result ) Game.applyEffect( this.result );
			if ( this.loot ) Game.getLoot( this.loot ); 
		}
	}

	percent() {
		return 100*(this._exp / this._length );
	}

	toJSON(){

		let data = super.toJSON();

		if ( this.length ) data.length = this.length;
		if ( this._exp ) data.exp = this._exp;

		return data;

	}

	constructor( vars=null ){

		super(vars);

		this.repeat = this.repeat === false ? false : true;
		this.type = 'action';

	}

}