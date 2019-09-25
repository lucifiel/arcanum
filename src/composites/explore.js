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

	get combat() { return this._combat; }
	set combat(v) { this._combat = v instanceof Combat ? v : new Combat(v); }

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

		this._combat =  this._combat || new Combat();

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

		Events.add( ENEMY_SLAIN, this.enemyDied, this );

		if ( typeof this.locale === 'string') this.locale = gameState.getData(this.locale);

		if ( !this.locale) this.running = false;

		this._combat.revive( gameState );

	}

	update(dt) {

		if ( this.locale == null || this.complete ) return;

		if ( this._combat.complete ) {

			this.combatDone();
			if ( !this.complete ) this.nextCombat();

		} else this._combat.update(dt);

	}

	/**
	 * Get next locale enemy.
	 */
	nextCombat() {


		/**
		 * @todo: maket this happen automatically.
		 */
		this.player.delay = getDelay( this.player.speed );
		this.combat.setEnemies( this.locale.getEnemy(), this.exp/this.length );

	}

	enemyDied( enemy, attacker ) {

		this.player.exp += 1 + Math.max( enemy.level - this.player.level, 0 );
		attacker.timer =attacker.delay;

		//console.log('ENEMY templ: ' + (typeof enemy.template) );

		if ( enemy.template && enemy.template.id ) {

			let tmp = this.state.getData(enemy.template.id );
			if ( tmp ) {
				tmp.value++;
			}
		}

		if ( enemy.result ) Game.applyEffect( enemy.result );
		if ( enemy.loot ) Game.getLoot( enemy.loot, this.drops );
		else Game.getLoot( {max:enemy.level, pct:30}, this.drops );

	}

	combatDone() {
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
				this.combat.clear();
				this.drops.clear();
			}

			if ( d.exp >= d.length ) {
				d.exp = 0;
			}
		}

		this.locale = d;
		if ( this.combat.complete ) this.nextCombat();

	}

	hasTag(t) { return t==='raid'; }

}