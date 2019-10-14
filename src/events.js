import Emitter from 'eventemitter3';
import {uppercase} from './util/util';

/**
 * @const {Emitter} events - emitter for in-game events.
 */
const events = new Emitter();

/**
 * @const {Emitter} sys - emitter for system-level events.
 * (save,load,gameLoaded, etc.)
 */
const sys = new Emitter();

const EVT_COMBAT = 'combat';
/**
 * Generic game event.
 */
const EVT_EVENT = 'event';
const EVT_UNLOCK = 'unlock';
const EVT_LOOT = 'loot';
const EVT_DISABLED = 'disabled';

const LOG_EVENT = 1;
const LOG_UNLOCK = 2;
const LOG_LOOT = 4;
export const LOG_COMBAT = 8;
const LOG_DISABLED = 16;

export const LogTypes = {
	'event':LOG_EVENT,
	'unlock':LOG_UNLOCK,
	'loot':LOG_LOOT,
	'combat':LOG_COMBAT
};

const COMBAT_DONE = 'combat_done';
const ENEMY_SLAIN = 'slain';

/**
 * BASIC ITEM EVENTS
 */
export const TRY_BUY = 'buy';
export const TRY_USE = 'tryuse';
export const TRY_SELL = 'trysell';
export const TRY_USE_WITH = 'tryusewith';
export const USE = 'use';

export const SET_SLOT = 'set_slot';

/**
 * Any character died by damage.
 */
const CHAR_DIED = 'char_died';

const ALLY_DIED = 'ally_died';

/**
 * player defeated by some stat.
 */
const DEFEATED = 'defeated';

const DAMAGE_MISS = 'damage_miss';
export const IS_IMMUNE = 'dmg_immune';

const ENEMY_HIT = 'enemy_hit';
const PLAYER_HIT = 'player_hit';
const LEVEL_UP = 'levelup'

const ACT_CHANGED = 'actchanged';
const ACT_IMPROVED = 'actimprove';

/**
 * stop all running actions.
 */
const STOP_ALL = 'stopall';

/**
 * Dispatched by a Runnable when it has completed.
 * It is the job of the runnable to determine when it has completed.
 */
const ACT_DONE = 'act_done';

/**
 * Action should be stopped by runner.
 */
const HALT_ACT = 'halt_act';

/**
 * Action blocked or failed.
 */
const ACT_BLOCKED = 'act_blocked';

/**
 * Triggered when Action, Skill, or Dungeon reaches max experience.
 */
const EXP_MAX = 'exp_max';

/**
 * Item with attack used. Typically spell; could be something else.
 */
const ITEM_ATTACK = 'item_atk';

/**
 * Completely delete item data. Use for Custom items only.
 */
const DELETE_ITEM = 'delitem';

/**
 * Encounter done.
 */
const ENC_DONE = 'enc_done';
const ENC_START = 'enc_start'
const ENTER_LOC = 'enter_loc';
const EXIT_LOC = 'exit_loc';

const NEW_TITLE = 'newtitle';

export { HALT_ACT, EVT_COMBAT, EVT_EVENT, EVT_UNLOCK, EXP_MAX, EVT_LOOT, ACT_DONE, ALLY_DIED, CHAR_DIED,
	ENTER_LOC, EXIT_LOC, ITEM_ATTACK, STOP_ALL, DELETE_ITEM,
	ACT_CHANGED, ACT_IMPROVED, ACT_BLOCKED, NEW_TITLE,
	DAMAGE_MISS, ENEMY_HIT, PLAYER_HIT, DEFEATED, ENEMY_SLAIN, COMBAT_DONE, ENC_START, ENC_DONE, LEVEL_UP };

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
		events.addListener( NEW_TITLE, this.onNewTitle, this );

		events.addListener( ACT_IMPROVED, this.actImproved, this );

		events.addListener( EVT_COMBAT, this.onCombat, this );
		events.addListener( ENEMY_SLAIN, this.enemySlain, this );
		events.addListener( DEFEATED, this.onDefeat, this );
		events.addListener( DAMAGE_MISS, this.onMiss, this );
		events.addListener( IS_IMMUNE, this.onImmune, this );
		events.addListener( ENC_START, this.onEnc, this );

	},

	clearGameEvents() {

		events.removeAllListeners();

	},

	/**
	 * Event item event.
	 * @param {Item} it
	 */
	onEvent( it ) {
		if ( it.hidden) return;
		this.log.log( it.name, it.desc, LOG_EVENT );
	},

	onUnlock( it ) {
		if ( it.hidden) return;
		this.log.log( uppercase(it.type) + ' Unlocked: ' + it.name, null, LOG_UNLOCK );
	},

	onLoot( loot ) {

		if ( !loot ) return;

		this.log.log( 'LOOT', this.getDisplay(loot), LOG_LOOT );

	},

	/**
	 * Get display string for item or item list.
	 * Empty and null entries are skipped.
	 * @param {string|string[]|Nameable} it
	 * @returns {string}
	 */
	getDisplay( it ) {

		if ( typeof it === 'object') {

			if ( Array.isArray(it) ) {

				let i=0, len = it.length;

				while ( i < len && it[i] == null ) i++;
				if ( i >= len ) return '';

				let text = this.getDisplay(it[i]);
				while ( ++i < len ) {
					if ( it[i]) text += ', ' + this.getDisplay(it[i]);
				}

			} else return it.name;
		}

		return it;

	},

	actionDone(it){
	},

	onNewTitle(t) {
		this.log.log( 'Title Earned: ' + uppercase(t), null, LOG_UNLOCK );
	},

	actImproved(it) {

		this.log.log( it.name + ' Improved', null, LOG_UNLOCK );
	},

	onLevel( player ) {
		this.log.log( player.name + ' Level Up!', null, LOG_EVENT );
	},

	onDefeat( locale ) {

		this.log.log( 'Retreat', '', LOG_COMBAT );

	},

	onImmune( msg ) {
		this.log.log( 'IMMUNE', msg, LOG_COMBAT );
	},

	onMiss( msg ) {

		this.log.log( '', msg, LOG_COMBAT );
	},

	onEnc( title, msg ) {
		this.log.log( title, msg, LOG_COMBAT );
	},

	onCombat( title, msg) {
		this.log.log( title, msg, LOG_COMBAT );
	},

	enemySlain( enemy, attacker ) {
		this.log.log( '', enemy.name + ' slain' + ( attacker ? ' by ' + attacker.name : ''), LOG_COMBAT );
	},

	/**
	 * Dispatch a game-level event.
	 * @param  {...any} params
	 */
	emit( ...params ) {
		events.emit.apply( events, params );

	},

	/**
	 *
	 * Add game-event listener.
	 * @param {string} evt
	 */
	add( evt, listener, context ) {
		events.addListener(evt, listener, context );
	},

	/**
	 * listen for system-level events.
	 * @param {*} evt
	 * @param {*} f
	 * @param {*} context
	 */
	listen(evt, f, context) {
		sys.addListener(evt,f,context);
	},

	/**
	 * Dispatch a system-level event.
	 * pause,save,reload,etc.
	 * @param  {...any} params
	 */
	dispatch( ...params ) {
		sys.emit.apply( sys, params );
	}


}