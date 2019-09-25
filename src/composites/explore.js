/**
 * Explore locations of arcane importance.
 */
export default class Explore {

	get id() { return 'explore';}

	/**
	 * @property {string} name - name of locale in progress.
	 */
	get name() { return this.locale? this.locale.name : ''; }

	get cost() { return this.locale ? this.locale.cost : null; }
	get run() { return this.locale ? this.locale.run : null; }

	get exp(){ return this.locale ? this.locale.exp : 0; }
	set exp(v){

		if ( v >= this.locale.length ) {
			this.exploreDone( this.locale );
		} else this.locale.exp=v;

	}

	percent() { return this.locale ? this.locale.percent() : 0; }
	maxed() { return !this.locale || this.locale.maxed(); }

	canUse() { return this.locale && !this.locale.maxed(); }

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

	get complete() { return this.exp === this.length; }

	toJSON() {

		return {
			locale:this.locale ? this.locale.id : undefined,
			drops:this.drops
		}

	}

	/**
	 *
	 * @param {?Object} [vars=null]
	 */
	constructor( vars=null ) {

		if ( vars ) Object.assign( this, vars);

		this.drops = this._drops || new Inventory();

		this.running = this.running || false;

		this.type = 'raid';

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

		if ( this.locale == null || this.complete ) return;

	}

	/**
	 * subarea compelte.
	 * @param {*} area
	 */
	areaDone( area ) {

		this.player.exp += 1 + Math.max( area.level - this.player.level, 0 );

		//console.log('ENEMY templ: ' + (typeof enemy.template) );

		if ( area.template && area.template.id ) {

			let tmp = this.state.getData(area.template.id );
			if ( tmp ) {
				tmp.value++;
			}
		}

		if ( area.result ) Game.applyEffect( area.result );
		if ( area.loot ) Game.getLoot( area.loot, this.drops );
		else Game.getLoot( {max:area.level, pct:30}, this.drops );

	}

	/**
	 * advance locale progress.
	 */
	advance() {
		this.exp += 1;
	}

	exploreDone() {

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

	setLocation( d ) {


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

	hasTag(t) { return t==='raid'; }

}