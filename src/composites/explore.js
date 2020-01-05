import Events, { DEFEATED, ACT_DONE,ACT_BLOCKED, ENC_START } from "../events";
import { getDelay } from "../chars/char";

import Game from '../game';
import Encounter from "../items/encounter";
import { itemRevive } from "../modules/itemgen";
import { EXPLORE } from "../values/consts";

/**
 * Explore locations of arcane importance.
 */
export default class Explore {

	get id() { return EXPLORE;}

	toJSON() {

		let enc = this.enc;

		return {
			locale:this.locale ? this.locale.id : undefined,
			enc:enc ? enc.id : undefined
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
	canRun(g) { return this.locale && !this.player.defeated() && this.locale.canRun(g); }


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

		this.type = EXPLORE;

		// reactivity.
		this._enc = this._enc || null;

		/**
		 * @property {locale} locale - current locale.
		 */
		this.locale = this.locale || null;

	}

	revive( gs ) {

		this.state = gs;
		this.player = gs.player;
		this.spelllist = gs.getData('spelllist');

		if ( typeof this.locale === 'string') this.locale = gs.getData(this.locale);

		if ( this._enc ) {

			if ( typeof this._enc === 'string' ) this.enc = gs.getData(this._enc);
			else {
				/** @compat */
				this.enc = gs.getData( this.enc.id );
			}

		}

		if ( !this.locale) this.running = false;

	}

	runWith( d ) {

		this.player.timer = getDelay( this.player.speed );

		if ( d != null ) {

			if ( d != this.locale ) this.enc = null;
			if ( d.exp >= d.length ) {
				d.exp = 0;
			}
		}

		this.locale = d;

	}

	/**
	 * try casting spell from player spelllist.
	*/
	tryCast(){

		if ( !this.spelllist.canUse(Game) ) return false;
		return this.spelllist.onUse(Game);

	}

	update(dt) {

		if ( this.locale == null || this.done ) return;

		if ( !this.enc ) this.nextEnc();
		else {

			this.player.timer -= dt;
			if ( this.player.timer <= 0 ) {

				this.player.timer += getDelay( this.player.speed )

				// attempt to use cast spell first.
				if ( this.spelllist.count > 0 ) {
					this.tryCast();
				}

			}

			this.enc.update( dt );
			if ( this.player.defeated() ) {

				Events.emit( DEFEATED, this );
				Events.emit( ACT_BLOCKED, this, true );

			} else if ( this.enc.done ) {

				this.encDone( this.enc );
				this.advance();

			}
		}

	}

	nextEnc(){

		if ( !this.locale ) return;
		// get random encounter.
		this.player.timer = getDelay( this.player.speed );
		var e = this.locale.getEnc();

		if ( typeof e === 'string') {

			var it = this.state.getData(e);

			if ( it ){

				Events.emit( ENC_START, it.name, it.desc );
				this._enc = it;
				it.exp = 0;

			} else console.warn('MISSING ENCOUNTER: ' + e );

		}

	}

	/**
	 * encounter complete.
	 * @param {Encounter} enc
	 */
	encDone( enc ) {

		this.player.exp += 0.75 + Math.max( enc.level - this.player.level, 0 );

		//console.log('ENEMY templ: ' + (typeof enemy.template) );

		enc.value++;

		if ( enc.result ) Game.applyVars( enc.result );
		if ( enc.loot ) Game.getLoot( enc.loot, Game.state.drops );

		enc.exp = 0;
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
		if ( this.locale.result ) Game.applyVars( this.locale.result );

		if ( this.locale.once && this.locale.value === 0 ) Game.applyVars( this.locale.once );

		this.locale.value++;

		var del = Math.max( 1 + this.player.level - this.locale.level, 1 );

		this.player.exp +=	(this.locale.level)*( 15 + this.locale.length )/( 0.8*del );

		this.enc = null;

		Events.emit( ACT_DONE, this, false );
		this.locale = null;

	}

	hasTag(t) { return t===EXPLORE; }

}