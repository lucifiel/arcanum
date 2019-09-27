import Inventory from "../chars/inventory";
import { DEFEATED } from "../events";

/**
 * Explore locations of arcane importance.
 */
export default class Explore {

	get id() { return 'explore';}

	toJSON() {

		return {
			locale:this.locale ? this.locale.id : undefined,
			enc:this.enc,
			drops:this.drops
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

	/**
	 * @property {Inventory} drops - items dropped in current locale.
	 * can be taken by player.
	 */
	get drops() { return this._drops; }
	set drops(v) {
		this._drops = (v instanceof Inventory ) ? v : new Inventory(v);
	}

	get enc() { return this._enc; }
	set enc(v) { this._enc = v; }

	get done() { return this.exp === this.length; }

	/**
	 *
	 * @param {?Object} [vars=null]
	 */
	constructor( vars=null ) {

		if ( vars ) Object.assign( this, vars);

		this.drops = this._drops || new Inventory();

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

		this.drops.revive(gameState);

		if ( typeof this.locale === 'string') this.locale = gameState.getData(this.locale);

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

			if ( this.enc ) this.enc.update(dt);

			if ( this.enc.complete ) {

				this.encDone( this.enc );
				this.advance();

			}

			if ( this.player.defeated ) {
				Events.dispatch( DEFEATED, this );
			}

		}

	}

	nextEnc(){

		if ( !this.locale ) return;
		// get random encounter.
		this.player.delay = getDelay( this.player.speed );
		this._enc = this.locale.getEnc();

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
		if ( enc.loot ) Game.getLoot( enc.loot, this.drops );

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

		if ( this.locale.loot ) Game.getLoot( this.locale.loot, this.drops );
		if ( this.locale.result ) Game.applyEffect( this.locale.result );
		this.locale.value++;

		var del = Math.max( 1 + this.player.level - this.locale.level, 1 );

		this.player.exp +=	(this.locale.level)*( 15 + this.locale.length )/( 0.8*del );

		Events.dispatch( ACT_DONE, this, false );
		this.locale = null;

	}

	enter( d ) {

		this.player.timer = this.player.delay;

		if ( d != null ) {

			if ( d != this.locale ) {
				this.drops.clear();
			}

			if ( d.exp >= d.length ) {
				d.exp = 0;
			}
		}

		this.locale = d;

	}

	hasTag(t) { return t==='explore'; }

}