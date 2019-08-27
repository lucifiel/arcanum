<script>
import Game from '../game';
import Menu from './component/menu.vue';
import ResoucesView from './resources.vue';
import ActionsView from './actionsView.vue';
import upgrades from './upgrades.vue';
import HomeView from './homes.vue';
import EquipView from './equip.vue';
import Quickbar from './quickbar.vue';
import Inventory from './inventory.vue';
import Bestiary from './bestiary.vue';

import ItemsBase from './itemsBase';

import Warn from './component/warn.vue';
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
	e:'exp',
	t:'stamina',
	h:"hp",
	k:'sp',
	m:'mana',
	c:'codices',
	a:'arcana',
	r:'research'
}
/**
 * @listens [sell,itemover,itemout]
 */
export default {

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
		inventory:Inventory,
		homes:HomeView,
		quickbar:Quickbar,
		player:PlayerView,
		bestiary:Bestiary,
		spellbook:Spellbook,
		adventure:Adventure,
		warn:Warn,
		'vue-menu':Menu
	},
	data(){

		return {
			state:null,
			overItem:null,
			overElm:null,
			section:null
		};


	},
	created(){

		/**
	 	* @property {Game} game
	 	*/
		this.game = Game;

		this.listen('game-loaded', this.gameLoaded );

		this.listen( 'sell', this.onSell );
		this.listen( 'take', this.onTake );
		this.listen( 'itemover', this.itemOver );
		this.listen( 'itemout', this.itemOut );

		this.listen( 'upgrade', this.onUpgrade );
		this.listen( 'action', this.onAction );
		this.listen( 'raid', this.onRaid );
		this.listen( 'rest', this.onRest );

		this.listen('equip', this.onEquip );
		this.listen('unequip', this.onUnequip );
		this.listen('drop', this.onDrop );

		this.listen('home', this.onHome );

		this.listen( 'spell', this.onSpell );
		this.listen( 'buy', this.onBuy );

		this.listen('pause', this.pause );
		// primary attack.
		this.listen( 'primary', this.onPrimary);


	},
	methods:{

		gameLoaded() {

			this.state = Game.state;
			this.section = this.state.sections.find( v=>v.id==='sect_main');

			window.addEventListener('keydown',evt=>{
				this.keyDown( evt ); evt.stopPropagation(); }, false );

			this.unpause();

		},

		fileDrop(e){
			e.stopPropagation();
			e.preventDefault();

			e.target.classList.remove('hilite');
	
			const dt = e.dataTransfer;
			this.dispatch('load-file', dt.files);
			
		},
		fileDrag(e){
			e.stopPropagation();
			e.preventDefault();
			e.currentTarget.classList.add('hilite');
		},
		dragOut(e){
			e.stopPropagation();
			e.preventDefault();
			e.currentTarget.classList.remove('hilite');
		},

		pause() {
			
			if ( this.runner ) {
				let int = this.runner;
				this.runner = null;
				clearInterval( int );
			}

		},
		unpause() {

			if ( this.game.loaded && !this.runner ) {
				this.game.lastUpdate = Date.now();
				this.runner = setInterval( ()=>this.game.update(), TICK_TIME );
			}

		},

		keyDown( e ){

			if ( !this.runner ) return;

			let slice = e.code.slice(0,-1);
			if ( slice === 'Digit' || slice === 'Numpad' ) {

				let num = Number( e.code.slice(-1) );
				//console.log('number: ' + num );
				
				if ( e.shiftKey && this.overItem ) this.state.setQuickSlot( this.overItem, num );
				else {
					let it = this.state.getQuickSlot(num);
					if ( it) this.game.tryItem( it );
				}

			} else {

				let key = e.key.toLowerCase();
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

		onEquip( it, inv ) { this.game.equip( it,inv ); },

		onUnequip(slot, it){ this.game.unequip(slot, it) },

		/**
		 * Drop item from inventory.
		 * @param {Item} it - item to drop
		 */
		onDrop(it) { this.game.drop(it); },

		onTake(it) { this.game.take(it); },

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
		onHome(it) { this.game.tryItem(it); },

		onUpgrade(upgrade) {

			if ( upgrade.warn ) this.$refs.warn.warn( upgrade );
			else this.game.tryItem(upgrade);

		},
	
		onConfirmed(it) { this.game.tryItem(it); },

		onSpell( spell ) { this.game.tryItem(spell); },

		onAction( action ) {

			if ( action.perpetual || action.length > 0 ) {

				this.game.setAction(action);

			} else this.game.tryItem( action );
		},

		/**
		 * Buy a spell or item without casting/using the item or its mods.
		 * @property {Item} item - item to buy.
		 */
		onBuy(item) {
			this.game.tryBuy(item);
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

		menuItems(){ return this.state.sections.filter( it=>!this.locked(it) ); }

	}

}
</script>

<template>

	<div class="full" @mouseover.capture.stop="dispatch('itemout')">

		<div class="top-bar">	
			<button @click="dispatch('save')">save</button>
			<button @click="dispatch('load')">load</button>

			<a class="text-button" id="save-file" href=""
				download @click="dispatch('save-file',$event)" type="text/json">Get File</a>
			<!--<input type="file" name="[File]" accept="text/json" @change="fileDrop">-->
			<button id="drop-file" @drop="fileDrop"
				@dragover="fileDrag" @dragleave.capture.stop="dragOut">[Drop File]</button>

			<confirm @confirm="dispatch('reset')">reset</confirm>
			<dots v-if="state" :dots="state.player.dots" />
			<span class="load-message" v-if="!state">LOADING DATA...</span>
		</div>
		
		<!-- popups -->
		<itempopup :item="overItem" :elm="overElm" />
		<warn ref="warn" @confirmed="onConfirmed" />

		<div v-if="state" class="main">

		<resources :items="state.resources"/>

		<vue-menu class="mid-view" :items="menuItems" v-model="section">

		<template slot="sect_main">
		<actions class="action-list" :items="state.actions" />
		<upgrades class="upgrade-list" :items="state.upgrades" />
		<upgrades class="upgrade-list" :items="state.classes" />

		</template>
	
		<template slot="sect_skills"><skills :state="state"></skills></template>

		<template slot="sect_player"><player /></template>

		<template slot="sect_house"><homes :state="state" /></template>
	
		<template slot="sect_raid"><adventure :state="state" /></template>

		<template slot="sect_equip">

			<div class="inv-equip">
			<equip :equip="state.equip" />
			<inventory :inv="state.inventory" />
			</div>

		</template>
	
		<template slot="sect_spells"><spellbook :state="state" /></template>

		<template slot="sect_bestiary"><bestiary /></template>
	
		</vue-menu>

		<vitals :player="state.player" :state="state" />

		<log :log="game.log" />

		</div>

		<div v-if="state" class="bot-bar"><quickbar :slots="state.quickslots" /></div>

	</div>
</template>

<style scoped>

#save-file {
	text-decoration: none;
}
#drop-file {
	border: 1.75px dashed rgb(117, 117, 117);
}

div.full {
	display:flex;
	flex-direction: column;
	min-width:500px;
	width: 98vw;
	max-height:100vh;
	height:100vh;
	margin: 0px;
}

span.load-message {
	padding: 8px 8px 2px;
}

div.top-bar {
	display:flex;
	min-height: 18px;
	width:100%;
}

div.main {
	display:flex;
	max-height: 85vh;
	flex-direction: row;
	flex-grow: 1;
	justify-content: space-between;
}

div.mid-view {
	display:flex;
	flex-flow: column nowrap;
	max-height: 100%;
	height:100%;
	flex-basis:42%;
	min-width: 320px;
	margin: 0px 12px 0px 32px;
	align-content: space-around;
}

div.action-list, div.upgrade-list {
	display:flex;
	flex-flow: row wrap;
	justify-content:left;
	flex-direction: row;
	text-transform: capitalize;
}

div.resource-list, div.center-view,
div.upgrade-list {
	margin: 20px 2px 2px;

}

div.inv-equip {
	display:flex;
	flex-direction: row;
	overflow-y: auto;
	justify-content: space-between;
	height: 80vh;
	width:100%;
}


</style>