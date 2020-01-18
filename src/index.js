import Game from './game';
import Events from './events';
import Profile from 'modules/profile';

import Vue from 'vue';
import Main from 'ui/main.vue';

import Confirm from 'ui/components/confirm.vue';

import { FBRemote } from './remote/remote';
//window.localStorage.clear();

if ( __KONG ) {

	kongregateAPI.loadAPI( function(){

	window.kong = kongregateAPI.getAPI();
	// You can now access the Kongregate API with:
	// kongregate.services.getUsername()

	});
}

/**
 * @const {number} MIN_UPLOAD_WAIT - minimum time in milliseconds for automatic
 * save uploading.
 */
const MIN_UPLOAD_WAIT = 3*60*1000;

/**
 * @const {number} MANUAL_UPLOAD_WAIT - minimum wait time in milliseconds
 * between manual save uploads.
 */
const MANUAL_UPLOAD_WAIT = 10*1000;


Vue.mixin({

	components:{ confirm:Confirm },
	methods: {

		/**
		 * System-related events.
		 */
		listen:Events.listen,
		dispatch:Events.dispatch,
		removeListener:Events.removeListener,

		/**
		 * Game-level events.
		 */
		emit:Events.emit,
		add:Events.add,

		// get id for html element.
		elmId(name) { return name + this._uid; }

	}

});

/**
 * @fires {} register-error
 * @fires {} register-sent
 * @fires {} logged-in
 */
const vm = new Vue({
	el: '#vueRoot',
	components:{
		Main
	},
	data(){
		// hacky re-render force. used to rerender on game reload.
		return {
			active:Profile.active,
			renderKey:1
		}
	},
	created(){

		this.remote = FBRemote;
		this.lastUpload = 0;

		this.saveLink = null;
		this.game = Game;

		this.tryAutoLogin();

		this.listen('save-file', this.saveFile, this );
		this.listen('hall-file', this.hallFile, this );

		this.listen('load-file', this.loadFile, this );
		this.listen('load', this.loadSave, this );
		this.listen('reset', this.reset,this );
		this.listen('resetHall', this.resetHall, this );

		this.listen('stat', this.doStat, this );

		this.listen('save-settings', Profile.saveSettings, Profile );

		this.listen('set-char', this.setChar, this );
		this.listen('dismiss-char', this.dismissChar, this );

		this.listen('save', this.manualSave );
		this.listen('autosave', this.save );

		this.listen( 'setting', this.onSetting, this );
		this.listen( 'logout', this.logout, this );
		this.listen( 'login-changed', this.onLoginChanged, this );
		this.listen( 'try-register', this.tryRegister, this );

		this.loadProfile();

	},
	methods:{

		tryAutoLogin(){

			if ( this.remote.loggedIn ) {
				return;

			} else {

				// check mongo key.
				//let key = window.localStorage.getItem('user-key');
				//if ( key ) {
				//	this.remote.keyLogin(key);
				//}

			}

		},

		onLoginChanged( loggedIn ){
			Profile.loggedIn = loggedIn;
		},

		logout(){

			this.remote.logout();
			Profile.loggedIn=false;

		},

		tryRegister(email, pw ){

			console.log('try register: ' + email );

			if ( !this.remote ) return;

			this.remote.register(email,pw).then(
				()=>{
					this.dispatch('register-sent');
				},
				err=>{
					console.log('dispatch reg error');
					this.dispatch('register-error', err );
				}
			);

		},

		tryLogin(uname, pw) {
		},

		loadProfile(){

			//if ( forceClear ) this.reset();

			console.warn('LOADING PROFILE');
			Profile.loadHall().then( ()=>this.loadSave() );


		},

		doStat( evt, val ) {

			if ( window.kong ) {
				window.kong.stats.submit( evt, val );
			}
		},

		/**
		 * Set current character.
		 */
		setChar( ind ){

			Profile.setActive( ind, this.game.state );
			this.loadSave();

		},

		dismissChar(ind) {

			//console.log('DISMISS: ' + ind );
			Profile.dismiss( ind );

		},

		/**
		 * Load the save for the active wizard.
		 */
		loadSave() {

			try {

				this.dispatch('pause');

				if ( this.remote.loggedIn ) this.remote.loadChar().then(json=>{

					console.warn('LOADED: ' + json );
					this.setStateJSON( json );

				err=>{
					console.warn(err);
					this.setStateJSON(null);
				}});

				else {
					let str = Profile.loadActive();
					this.setStateJSON( JSON.parse(str) );
				}


			} catch (e ) { console.error( e.message + '\n' + e.stack ); }

		},

		/**
		 * Game was revived from JSON.
		 * @param {Game} game
		 */
		gameLoaded( game ) {

			if ( !game ) console.warn('gameloaded(): NULL' );

			let settings = Profile.loadSettings();
			this.onSettings( settings );

			this.dispatch( 'game-loaded' );

			Profile.gameLoaded( game );

			this.dispatch('unpause');

		},

		/**
		 * Call on settings loaded.
		 * @param {*} vars
		 */
		onSettings(vars){

			if (!vars) return;

			this.onSetting( 'darkMode', vars.darkMode );
			this.onSetting( 'compactMode', vars.compactMode );
		},

		onSetting( setting, v ) {

			if ( setting === 'darkMode') {

				if ( v ) document.body.classList.add( 'darkmode');
				else document.body.classList.remove( 'darkmode');

			} else if ( setting === 'compactMode' ) {

				if ( v ) document.body.classList.add( 'compact');
				else document.body.classList.remove( 'compact');

			}

		},

		saveFile(e ){

			// event shouldnt be null but sometimes is.
			if (!e )return;
			try {

				if ( this.saveLink ) URL.revokeObjectURL( this.saveLink );

				let state = this.game.state;
				this.saveLink = this.makeLink( state, e.target, state.player.name );

			} catch(ex) {
				console.error( ex.message + '\n' + ex.stack );
			}

		},

		hallFile(e){

			if ( !e ) return;

			this.save();		// save game first.

			try {

				if ( this.hallLink) URL.revokeObjectURL( this.hallLink );

				let data = Profile.getHallSave();
				this.saveLink = this.makeLink( data, e.target, 'hall');

			} catch(ex){
				console.error( ex.message + '\n' + ex.stack );
			}

		},

		/**
		 * Create URL link for data.
		 * @param {object} data
		 * @param {HTMLElement} targ - link target.
		 * @returns {DOMString}
		 */
		makeLink( data, targ, saveName='arcanum' ) {

			let json = JSON.stringify(data);
			let file = new File( [json], saveName + '.json', {type:"text/json;charset=utf-8"} );

			targ.title = file.name;
			return targ.href = URL.createObjectURL( file );

		},

		loadFile(files) {

			const file = files[0];
			if ( !file) return;

			this.dispatch('pause');

			const reader = new FileReader();
			reader.onload = (e)=>{

				try {

					let data = JSON.parse( e.target.result );
					if ( data.type ==='hall') {

						this.setHallJSON( data );

					} else {

						this.setStateJSON( data );

					}


				} catch(err){
					console.error(  err.message + '\n' + err.stack );
				}

			}
			reader.readAsText( file );

		},

		/**
		 * Set JSON for complete hall-file with all associated wizards.
		 * @param {object} data
		 */
		setHallJSON( data ) {

			Profile.setHallSave( data );
			this.loadProfile();	// load the hall data back. bit wasteful but organized.

		},

		/**
		 * Set wizard-state game data in the form of a json
		 * text string.
		 * @param {object} obj - raw game data.
		 */
		setStateJSON( obj=null ){

			try {

				if ( this.game.loaded ) this.renderKey++;

				this.game.load( obj, Profile.getHallItems() ).then( this.gameLoaded,
					e=>console.error( e.message + '\n' + e.stack ) );

			} catch( err ) {
				console.error(  err.message + '\n' + err.stack );
			}
		},

		manualSave(){
			this.save(MANUAL_UPLOAD_WAIT);
		},

		save( minWait=MIN_UPLOAD_WAIT ) {

			if (!this.game.loaded ) return;
			let charsave = Profile.saveActive( this.game.state );
			Profile.saveHall();

			var t = Date.now();
			if ( this.remote.loggedIn && (t-this.lastUpload) > minWait ) {

				this.lastUpload = t;
				this.remote.saveChar( charsave ).then( res=>{
					console.log(res)
				}, err=>{
					console.warn(err);
				});

			}

		},

		reset(){

			this.dispatch('pause');
			Profile.clearActive();
			this.setStateJSON(null);


		},
		resetHall() {

			this.dispatch('pause');

			Profile.clearAll();

			this.loadProfile();

		}

	},
	render( createElm ) {
		return createElm( Main, { key:this.renderKey } );
	}

});