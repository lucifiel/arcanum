import Inventory from "../chars/inventory";
import Events, { DEFEATED, ACT_DONE,ACT_BLOCKED } from "../events";
import { getDelay } from "../chars/char";

import Game from '../game';
import Encounter from "../items/encounter";

/**
 * Explore locations of arcane importance.
 */
export default class Explore {

	get id() { return 'explore';}

	toJSON() {

		return {
			locale:this.locale ? this.locale.id : undefined,
			enc:this.enc
		}

	}

	/**
	 * @property {string} name - name of locale in progress.
	 */
	get name() { return this.locale? this.locale.name : ''; }

	get cost() { return this.locale ? this.locale.cost : null; }
	get run() { return this.locale ? this.locale.run : null; }

	get exp(){ return this.locale ? this.locale.exp : 0; }
	set exp(v){

		if ( v >= this.locale.length ) {
			this.complete();
		} else this.locale.exp=v;

	}

	percent() { return this.locale ? this.locale.percent() : 0; }
	maxed() { return !this.locale || this.locale.maxed(); }

	canUse() { return this.locale && !this.locale.maxed(); }

	get encs() { return this.locale ? this.locale.encs : null; }

	/**
	 * @property {number} length - length of locale in progress.
	 */
	get length() { return this.locale ? this.locale.length : 0; }

	get enc() { return this._enc; }
	set enc(v) { this._enc = v; }

	get done() { return this.exp === this.length; }

	/**
	 *
	 * @param {?Object} [vars=null]
	 */
	constructor( vars=null ) {

		if ( vars ) Object.assign( this, vars);

		this.running = this.running || false;

		this.type = 'explore';

		/**
		 * @property {locale} locale - current locale.
		 */
		this.locale = this.locale || null;

	}

	revive( gameState ) {

		this.state = gameState;
		this.player = gameState.player;

		if ( typeof this.locale === 'string') this.locale = gameState.getData(this.locale);

		if ( this._enc ) {
			this.enc = new Encounter(this._enc);
		}

		if ( !this.locale) this.running = false;

	}

	update(dt) {

		if ( this.locale == null || this.done ) return;

		if ( !this.enc ) this.nextEnc();

		// should be covered by runner.
		/*if ( this.locale.effect ) {
			Game.applyEffect( this.locale.effect, dt );
		}*/

		this.player.timer -= dt;
		if ( this.player.timer <= 0 ) {

			this.player.timer += this.player.delay;

			if ( this.enc ) {

				this.enc.update( this.player.delay );
				if ( this.enc.done ) {

					this.encDone( this.enc );
					this.advance();

				}
			}

			if ( this.player.defeated ) {
				Events.dispatch( DEFEATED, this );
				Events.dispatch( ACT_BLOCKED, this, false );
			}

		}

	}

	nextEnc(){

		if ( !this.locale ) return;
		// get random encounter.
		this.player.delay = getDelay( this.player.speed );
		var e = this.locale.getEnc();

		if ( typeof e === 'string') {

			var it = Game.instance(e);

			if ( it ){

				this._enc = it;
				it.exp = 0;

			} else console.warn('MISSING ENCOUNTER: ' + e );

		}

	}

	/**
	 * encounter complete.
	 * @param {*} enc
	 */
	encDone( enc ) {

		this.player.exp += 0.75 + Math.max( enc.level - this.player.level, 0 );

		//console.log('ENEMY templ: ' + (typeof enemy.template) );

		if ( enc.template && enc.template.id ) {

			let tmp = this.state.getData(enc.template.id );
			if ( tmp ) tmp.value++;

		} else enc.value++;

		if ( enc.result ) Game.applyEffect( enc.result );
		if ( enc.loot ) Game.getLoot( enc.loot, Game.state.drops );

		this.enc = null;

	}

	/**
	 * advance locale progress.
	 */
	advance() {
		this.exp += 1;
	}

	complete() {

		this.locale.exp = this.locale.length;
		this.locale.dirty = true;

		if ( this.locale.loot ) Game.getLoot( this.locale.loot, Game.state.drops );
		if ( this.locale.result ) Game.applyEffect( this.locale.result );
		this.locale.value++;

		var del = Math.max( 1 + this.player.level - this.locale.level, 1 );

		this.player.exp +=	(this.locale.level)*( 15 + this.locale.length )/( 0.8*del );

		this.enc = null;

		Events.dispatch( ACT_DONE, this, false );
		this.locale = null;

	}

	enter( d ) {

		this.player.timer = this.player.delay;

		if ( d != null ) {

			if ( d.exp >= d.length ) {
				d.exp = 0;
			}
		}

		this.locale = d;

	}

	hasTag(t) { return t==='explore'; }

}