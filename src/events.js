import Emitter from 'eventemitter3';
import {uppercase} from './util/util';

const events = new Emitter();

const EVT_COMBAT = 'combat';
/**
 * Generic game event.
 */
const EVT_EVENT = 'event';
const EVT_UNLOCK = 'unlock';
const EVT_LOOT = 'loot';

const COMBAT_DONE = 'combat_done';
const ENEMY_SLAIN = 'slain';
const ALLY_DIED = 'ally_died';
const PLAYER_SLAIN = 'died';
const DAMAGE_MISS = 'damage_miss';
const ENEMY_HIT = 'enemy_hit';
const PLAYER_HIT = 'player_hit';
const LEVEL_UP = 'levelup'
/**
 * player left dungeon.
 */
const EXIT_RAID = 'leftraid';

const ACT_CHANGED = 'actchanged';

/**
 * Dispatched when a running action completes.
 */
const ACTION_DONE = 'action_done';

export { EVT_COMBAT, EVT_EVENT, EVT_UNLOCK, EVT_LOOT, ACTION_DONE, ALLY_DIED, EXIT_RAID, ACT_CHANGED,
	DAMAGE_MISS, ENEMY_HIT, PLAYER_HIT, PLAYER_SLAIN, ENEMY_SLAIN, COMBAT_DONE, LEVEL_UP };

export default {

	log:null,

	init( game ) {

		this.log = game.log;
		this.game = game;

		this.clearGameEvents();

			events.addListener( EVT_LOOT, this.onLoot, this );
			events.addListener( EVT_UNLOCK, this.onUnlock, this );
			events.addListener( EVT_EVENT, this.onEvent, this );
			events.addListener( LEVEL_UP, this.onLevel, this );
			events.addListener( ACTION_DONE, this.actionDone, this );

			events.addListener( EVT_COMBAT, this.onCombat, this );
			events.addListener( ENEMY_SLAIN, this.enemySlain, this );
			events.addListener( PLAYER_SLAIN, this.onDied, this );
			events.addListener( DAMAGE_MISS, this.onMiss, this );
	},

	clearGameEvents() {

		events.removeAllListeners( EVT_COMBAT );
		events.removeAllListeners( EVT_LOOT );
		events.removeAllListeners( EVT_UNLOCK );
		events.removeAllListeners( EVT_EVENT );
		events.removeAllListeners( LEVEL_UP );
		events.removeAllListeners( ACTION_DONE );

		events.removeAllListeners( EVT_COMBAT );
		events.removeAllListeners( ENEMY_SLAIN );
		events.removeAllListeners( PLAYER_SLAIN );
		events.removeAllListeners( DAMAGE_MISS );
		events.removeAllListeners( COMBAT_DONE );
		events.removeAllListeners( PLAYER_HIT );
		events.removeAllListeners( ENEMY_HIT );
		events.removeAllListeners( ALLY_DIED );

	},

	/**
	 * Event item event.
	 * @param {Item} it
	 */
	onEvent( it ) {
		if ( it.hidden) return;
		this.log.log( it.name, it.desc, EVT_EVENT );
	},

	onUnlock( it ) {
		if ( it.hidden) return;
		this.log.log( uppercase(it.type) + ' Unlocked: ' + it.name, null, EVT_UNLOCK );
	},

	onLoot( loot ) {
	},

	actionDone(it){
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
	 * @alias add() for Vue switch-out.
	 * @param {*} evt
	 * @param {*} f
	 * @param {*} context
	 */
	listen(evt, f, context) {
		events.addListener(evt,f,context);
	},

	/**
	 *
	 * @param  {...any} params
	 */
	dispatch( ...params ) {
		events.emit.apply( events, params );
	}


}