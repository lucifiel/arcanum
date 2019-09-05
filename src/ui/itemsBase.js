/**
 * Base view for all item lists.
 */
import { floor } from 'format';
import {indexAfter} from '../util';

import Game from '../game';
import Skill from '../items/skill';

export default {

	methods:{

		floor:floor,

		showName(it) {
			return it.actname || it.name || it.id;
		},

		usable(it) {
			return (it.length || it.perpetual ) ? Game.canRun(it) : Game.canUse( it );
		},

		visible(it) {
			return !it.locked && it.disabled === false;
		},

		buyable(it) { return Game.canBuy(it)},

		reslocked( it ) {
			return it.disabled === true || it.locks > 0 || it.locked !== false;
		},

		runnable(it) {
			return it.perpetual || it.length>0;
		},

		locked(it) {

			return it.disabled === true || it.maxed() || it.locks>0 || it.locked !== false;

		},

		/**
		 *
		 * @param {*} obj
		 * @param {boolean} rate - items are rate.
		 */
		effectItems( obj, rate=false) {

			let type = typeof obj;
			let results = {};

			if ( type === 'number') {

				// gold is default.
				results.gold = obj;

			} else if ( type === 'string') {

				let it = Game.getData(obj);
				results[ it ? it.name : obj ] = true;

			} else if ( Array.isArray(obj) ) obj.forEach(v=>this.effectList(v,results));
			else if ( type === 'object') {

				this.effectList( obj, results, '', rate );

			}

			return results;

		},

		/**
		 * @param {Object} obj - object whose effects to enumerate.
		 * @param {Object} results - [name/effect] pairs to display to user.
		 * @param {string} propPath - prop path from base.
		 * @param {boolean} rate - whether display is per/s rate.
		 */
		effectList( obj, results={}, propPath='', rate=false ) {

			if ( typeof obj === 'string' ) {

				let it = Game.getData(obj);
				results[ it ? it.name : obj ] = true;
				return;
			}

			for( let p in obj ) {

				// displayed path to subitem.
				var subPath = p;
				var sub = obj[p];

				if ( p === 'skipLocked') continue;
				else if ( p === 'max' ) {

					let index = indexAfter( propPath, 'mod' );
					if ( index < 0 ) index = indexAfter( propPath, 'effect' );

					if ( index > 0 ) subPath = propPath.slice(0, index) + ' max' + propPath.slice(index);
					else subPath = 'max ' + propPath;

				} else if ( p==='base' || p === 'value') subPath = propPath;
				else if ( p === 'rate') {

					subPath = propPath;
					if ( typeof sub !== 'object' ) rate = true;

					let baseItem = propPath.split('.')[0];
					if ( Game.getData(baseItem) instanceof Skill ) subPath = 'train ' + subPath + ' rate';

				} else {

					// check if sub-prop refers to an item.
					let refItem = Game.getData(p);
					if ( refItem ) subPath = refItem.name;

					subPath = propPath ? propPath + ' ' + subPath : subPath;

				}

				if ( typeof sub !== 'object' ) results[subPath] = sub + ( rate ? '/s' : '');
				else {

					if ( sub.skipLocked ) {

						let refItem = Game.getData(p);
						if ( refItem && (refItem.locked || refItem.disabled) ) continue;

					}
					if ( sub.toString && (sub.toString != Object.prototype.toString) ) {

						results[subPath] = sub.toString() + ( rate ? '/s' : '');

					} else this.effectList( sub, results, subPath, rate );

				}

			}

		}

	}

}