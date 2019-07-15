<script>
import Menu from './menu.vue';
import ResoucesView from './resources.vue';
import ActionsView from './actionsView.vue';
import upgrades from './upgrades.vue';
import HomeView from './homes.vue';
import EquipView from './equip.vue';
import Quickbar from './quickbar.vue';

import ItemsBase from './itemsBase';

import Vitals from 'ui/vitals.vue';
import SkillsPane from './skillsPane.vue';
import Spellbook from 'ui/spellbook.vue';
import DotView from './dotView.vue';
import ItemPopup from './itemPopup.vue';
import PlayerView from './player.vue';
import LogView from './outlog.vue';
import Adventure from './adventure.vue';

import { TICK_TIME } from '../game';

const cheatKeys = {
	g:'gold',
	s:'scrolls',
	t:'stamina',
	m:'mana',
	c:'codices',
	a:'arcana',
	r:'research'
}
/**
 * @listens [sell,itemover,itemout]
 */
export default {

	/**
	 * @property {Game} game
	 */
	props:['game'],
	mixins:[ItemsBase],
	components:{
		resources:ResoucesView,
		actions:ActionsView,
		upgrades:upgrades,
		itempopup:ItemPopup,
		vitals:Vitals,
		log:LogView,
		skills:SkillsPane,
		dots:DotView,
		equip:EquipView,
		homes:HomeView,
		quickbar:Quickbar,
		player:PlayerView,
		spellbook:Spellbook,
		adventure:Adventure,
		'vue-menu':Menu
	},
	data(){

		return {
			state:this.game.state,
			overItem:null,
			overElm:null
		};


	},
	created(){

		this.listen( 'sell', this.onSell );
		this.listen( 'itemover', this.itemOver );
		this.listen( 'itemout', this.itemOut );
		this.listen( 'upgrade', this.onUpgrade );
		this.listen( 'action', this.onAction );
		this.listen( 'raid', this.onRaid );
		this.listen( 'rest', this.onRest );

		this.listen('home', this.onHome );

		this.listen( 'spell', this.onSpell );
		this.listen( 'learn', this.onLearn );

		// primary attack.
		this.listen( 'primary', this.onPrimary);

		//document.onkeydown = evt=>{this.keyDown(evt); evt.stopPropagation();}
		window.addEventListener('keydown',evt=>{
			this.keyDown( evt ); evt.stopPropagation(); }, false );

		this.unpause();

	},
	methods:{

		load() {
		},
		save() {
		},
		pause() {
			
			if ( this.interval ) {
				let int = this.interval;
				this.interval = null;
				clearInterval( int );
			}

		},
		unpause() {

			if ( !this.interval ) {
				this.game.lastUpdate = Date.now();
				this.interval = setInterval( ()=>this.game.update(), TICK_TIME );
			}

		},

		keyDown( e ){
	
			let key = e.key.toLowerCase();
			if ( !isNaN(key) ) {

				if ( this.overItem ) this.state.setQuickSlot( this.overItem, Number(key) );
				else {
					let it = this.state.quickslots[Number(key)];
					if ( it) this.game.tryItem( it );
				}

			} else {

				for( let p in cheatKeys ) {
					if ( key === p ) {
						if ( e.shiftKey ) this.state.addMax( cheatKeys[p] );
						else this.state.fillItem( cheatKeys[p]);
						break;
					}
				}
				if ( key === 'p') {
					if ( this.state.curAction && this.state.curAction.length) {
						this.state.curAction.progress = this.state.curAction.length;
					}
				}
			}

		},

		equip( slot, it ) {
			this.game.equip( slot, it );
		},

		unequip(slot, it){
			this.game.unequip(slot, it)
		},

		/**
		 * Drop item from inventory.
		 * @param {Item} it - item to drop
		 */
		drop(it) {
			this.state.inventory.remove(it);
		},

		onSell(it) {
			this.game.trySell( it );
		},

		itemOver(evt, it) {
			this.overItem = it;
			this.overElm = evt.currentTarget;
		},

		itemOut(){

			this.overElm = null;
			this.overItem = null;
		
		},

		onRest(){
			this.game.toggleAction( this.state.restAction );
		},

		/**
		 * Attempt to buy new house.
		 */
		onHome(it) {
			this.game.setHome(it);
		},

		onUpgrade(upgrade) {
			this.game.tryItem(upgrade);
		},
	
		onSpell( spell ) {
			this.game.tryItem(spell);
		},

		onAction( action ) {

			if ( action.perpetual || action.length > 0 ) {

			this.game.setAction(action);

			} else this.game.tryItem( action );
		},

		/**
		 * Learn to use a spell or item.
		 * @property {Item} item - item to learn.
		 */
		onLearn(item) {
			this.game.tryLearn(item);
		},

		/**
		 * @param {Dungeon} dungeon
		 * @param {boolean} enter
		 */
		onRaid( dungeon, enter ) {

			if ( enter ) this.game.startRaid( dungeon );
			else {
				this.state.raid.dungeon = null;
				this.game.setAction(null);

			}

		},

		onPrimary( s) {
			if ( this.state.player.primary === s) this.state.player.setPrimary(null);
			else this.state.player.setPrimary(s);
		}

	},
	computed:{

		completed() {

			let a = [];
			for( let evt of this.state.events ) {
	
				if ( !evt.locked || a.disabled ) a.push(evt);
				else if ( this.game.tryUnlock(evt) ) {

					this.game.doEvent(evt);
					a.push(evt);

				}

			}
			return a;

		},

		menuItems(){
			return this.state.sections.filter( it=>!this.locked(it) );
		}

	}

}
</script>

<template>

	<div class="full"
		@mouseover.capture.stop="dispatch('itemout')">

		<div class="top-bar">
			<dots :dots="state.dots" />
		</div>
		<div class="main">

		<!-- popup -->
		<itempopup :item="overItem" :elm="overElm" />

		<resources :items="state.resources"/>

		<vue-menu class="mid-view" :items="menuItems" active="main">

		<template slot="main">
		<actions :items="state.actions" />
		<upgrades :items="state.upgrades" />

		</template>
	
		<template slot="player">
			<player :player="state.player" />
		</template>

		<template slot="house">
			<homes :state="state" />
		</template>
	
		<template slot="raid">
			<adventure :state="state" />
		</template>

		<template slot="skills">
			<skills :state="state"></skills>
		</template>

		<template slot="spells">
			<spellbook :state="state" />
		</template>

		<template slot="equip">
			<equip :equip="state.equip" />
		</template>

		</vue-menu>

		<vitals :player="state.player" :state="state" />
		<log :log="game.log" />

		</div>

		<div class="bot-bar"><quickbar :state="state" /></div>

	</div>
</template>

<style scoped>

div.full {
	display:flex;
	flex-direction: column;
	flex-grow: 0;
	width: 100%;
	margin: 0px;
}

div.top-bar {
	display:flex;
	min-height: 24px;
	width:100%;
}

div.main {
	display:flex;
	flex-direction: row;
}

div.mid-view {
	flex-basis:35%;
	margin: 12px 8px;
}

</style>