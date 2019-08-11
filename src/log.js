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

	clear() {
		this.items.splice( 0, this.items.length );
	}

	log( title='', text='', type='event' ) {
		this.items.push( new LogItem(title, text, type ) );
	}

	logItem(it) {
		this.items.push( it);
	}

}