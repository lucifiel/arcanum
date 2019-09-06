import Emitter from 'eventemitter3';

const events = new Emitter();

const EVT_COMBAT = 'combat';
const EVT_EVENT = 'event';
const EVT_UNLOCK = 'unlock';
const EVT_LOOT = 'loot';

const COMBAT_DONE = 'combat_done';
const ENEMY_SLAIN = 'slain';
const PLAYER_SLAIN = 'died';
const DAMAGE_MISS = 'damage_miss';
const ENEMY_HIT = 'enemy_hit';
const PLAYER_HIT = 'player_hit';
const LEVEL_UP = 'levelup'

export { EVT_COMBAT, EVT_EVENT, EVT_UNLOCK, EVT_LOOT,
	DAMAGE_MISS, ENEMY_HIT, PLAYER_HIT, PLAYER_SLAIN, ENEMY_SLAIN, COMBAT_DONE, LEVEL_UP };

export default {

	log:null,

	ready:false,

	init( game ) {

		this.log = game.log;
		this.game = game;

		if ( !this.ready ) {

			events.addListener( EVT_LOOT, this.onLoot, this );
			events.addListener( EVT_UNLOCK, this.onUnlock, this );
			events.addListener( EVT_EVENT, this.onEvent, this );
			events.addListener( LEVEL_UP, this.onLevel, this );

			events.addListener( EVT_COMBAT, this.onCombat, this );
			events.addListener( ENEMY_SLAIN, this.enemySlain, this );
			events.addListener( PLAYER_SLAIN, this.onDied, this );
			events.addListener( DAMAGE_MISS, this.onMiss, this );

			this.ready = true;
		}

	},

	/**
	 * Event item event.
	 * @param {Item} it
	 */
	onEvent( it ) {
		this.log.log( it.name, it.desc, EVT_EVENT );
	},

	onUnlock( it ) {
		this.log.log( 'Unlocked: ' + it.name, null, EVT_UNLOCK );
	},

	onLoot( loot ) {
	},

	onLevel( player ) {
		this.log.log( player.name + ' Level Up!', null, EVT_EVENT );
	},

	onDied( attacker ) {
		this.log.log( 'Retreat', '', EVT_COMBAT );
	},

	onMiss( msg ) {

		this.log.log( '', msg, EVT_COMBAT );
	},

	onCombat( title, msg) {
		this.log.log( title, msg, EVT_COMBAT );
	},

	enemySlain( enemy, attacker ) {
		this.log.log( '', enemy.name + ' slain' + ( attacker ? ' by ' + attacker.name : ''), EVT_COMBAT );
	},

	/**
	 *
	 * @param {string} evt
	 */
	add( evt, listener, context ) {
		events.addListener(evt, listener, context );
	},

	/**
	 *
	 * @param  {...any} params
	 */
	dispatch( ...params ) {
		events.emit.apply( events, params );
	}


}