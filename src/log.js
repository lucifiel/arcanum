export class LogItem {

	constructor( title='', text='', type=''){

		this.text = text;
		this.title = title;

		/**
	 	* @var {string} type - message type.
	 	*/
		this.type = type;

	}

}

export default class Log {

	constructor( vars=null ) {

		if ( vars ) Object.assign( this, vars );

		/**
		 * @property {LogItem[]} items
		 */
		this.items = this.items || [];

	}

	log( title='', text='', type='event' ) {
		this.items.push( new LogItem(title, text, type ) );
	}

	addItem(it) {
		this.items.push( it);
	}

}