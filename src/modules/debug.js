export default class Debug {

	constructor( game ){

		this.game = window.game = game;
		console.log('old debug: ' + window.debug );

		window.debug = this;

	}

	unlock( str ){

		let data = this.game.state.getData(str);
		if ( data ) {

			console.log('UNLOCKING: ' + str);
			game.state.getData(str).locked = false;
			return true;

		}

		return false;

	}

}