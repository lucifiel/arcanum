import Events, { ENEMY_SLAIN, ACT_DONE } from '../events';

import Game from '../game';
import Inventory from '../chars/inventory';
import Combat from './combat';


/**
 * Represents an active dungeon raid.
 */
export default class Raid {

	/**
	 * @property {string} id - id of dungeon in progress.
	 */
	get id() { return this.dungeon ? this.dungeon.id : 'raid';}

	/**
	 * @property {string} name - name of dungeon in progress.
	 */
	get name() { return this.dungeon? this.dungeon.name : ''; }

	get cost() { return this.dungeon ? this.dungeon.cost : null; }
	get run() { return this.dungeon ? this.dungeon.run : null; }

	get exp(){ return this.dungeon ? this.dungeon.exp : 0; }
	set exp(v){

		if ( v >= this.dungeon.length ) {
			this.raidDone( this.dungeon );
		} else this.dungeon.exp=v;

	}

	percent() { return this.dungeon ? this.dungeon.percent() : 0; }
	maxed() { return !this.dungeon || this.dungeon.maxed(); }

	canUse() { return !this.dungeon.maxed(); }

	/**
	 * @property {number} length - length of dungeon in progress.
	 */
	get length() { return this.dungeon ? this.dungeon.length : 0; }

	get combat() { return this._combat; }
	set combat(v) { this._combat = v instanceof Combat ? v : new Combat(v); }

	/**
	 * @deprecated - used to pass through to combat.
	 */
	get enemies() { return this.combat ? this.combat._enemies : null; }
	set enemies(v) { if ( this.combat ) this.combat.enemies = v; }

	/**
	 * @property {Inventory} drops - items dropped in current dungeon.
	 * can be taken by player.
	 */
	get drops() { return this._drops; }
	set drops(v) {
		this._drops = (v instanceof Inventory ) ? v : new Inventory(v);
	}

	get complete() { return this.exp === this.length; }

	toJSON() {

		return {
			dungeon:this.dungeon ? this.dungeon.id : undefined,
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
		 * @property {Dungeon} dungeon - current dungeon.
		 */
		this.dungeon = this.dungeon || null;

	}

	revive( gameState ) {

		this.state = gameState;
		this.player = gameState.player;

		this.drops.revive(gameState);

		Events.add( ENEMY_SLAIN, this.enemyDied, this );

		if ( typeof this.dungeon === 'string') this.dungeon = gameState.getData(this.dungeon);

		this._combat.revive( gameState );

	}

	update(dt) {

		if ( this.dungeon == null || this.complete ) return;

		if ( this._combat.complete ) {

			this.combatDone();
			if ( !this.complete ) this.nextCombat();

		} else this._combat.update(dt);

	}

	/**
	 * Player-casted spell or action attack.
	 * @param {Item} it
	 */
	spellAttack( it ) { if ( this.dungeon ) this._combat.spellAttack(it); }

	/**
	 * Get next dungeon enemy.
	 */
	nextCombat() {

		this.combat.setEnemies( this.dungeon.getEnemy() );

	}

	enemyDied( enemy, attacker ) {

		this.player.exp += 1 + Math.max( enemy.level - this.player.level, 0 );
		attacker.timer =attacker.delay;

		console.log('enemy died');
		if ( enemy.template && enemy.template.id ) {

			let tmp = this.state.getData(enemy.template.id );
			if ( tmp ) {
				tmp.value++;
			}
		}

		if ( enemy.result ) Game.applyEffect( enemy.result );
		if ( enemy.loot ) Game.getLoot( enemy.loot, this.drops );

	}

	combatDone() {
		this.exp += 1;
	}

	raidDone() {

		this.dungeon.exp = this.dungeon.length;
		this.dungeon.dirty = true;

		if ( this.dungeon.loot ) Game.getLoot( this.dungeon.loot, this.drops );

		if ( this.dungeon.result ) Game.applyEffect( this.dungeon.result );

		var del = Math.max( 1 + this.player.level - this.dungeon.level, 1 );

		this.player.exp +=	(this.dungeon.level)*( 15 + this.dungeon.length )/( 0.8*del );

		Events.dispatch( ACT_DONE, this );
		this.dungeon = null;

	}

	setDungeon( d ) {

		this.player.timer = this.player.delay;

		if ( d != null ) {

			if ( d != this.dungeon ) {
				this.combat.clear();
				this.drops.clear();
			}

			if ( d.exp >= d.length ) {
				d.exp = 0;
			}
		}

		this.dungeon = d;
		if ( this.combat.complete ) this.nextCombat();

	}

	hasTag(t) { return t==='raid'; }
}