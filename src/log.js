export class LogItem {

	get title(){ return this._title; }
	set title(v) { this._title = v;}

	get text() { return this._text;}
	set text(v) { this._text = v; }

	/**
	 * @property {string} type - message type.
	 */
	get type() { return this._type; }
	set type(v) { this._type = v;}

	constructor( title='', text='', type=''){

		this._text = text;
		this._title = title;
		this._type =type;

	}

}

export default class Log {

	get items() {
		return this._items;
	}
	set items(v) { this._items = v;}

	constructor( vars=null ) {

		if ( vars ) Object.assign( this, vars );
		if ( !this._items ) this._items = [];

	}

	log( title='', text='', type='' ) {
		this._items.push( new LogItem(title, text, type ) );
	}

	addItem(it) {
		this._items.push( it);
	}

}