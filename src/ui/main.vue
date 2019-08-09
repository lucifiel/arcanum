<script>
import Game from '../game';
import Menu from './menu.vue';
import ResoucesView from './resources.vue';
import ActionsView from './actionsView.vue';
import upgrades from './upgrades.vue';
import HomeView from './homes.vue';
import EquipView from './equip.vue';
import Quickbar from './quickbar.vue';
import Inventory from './inventory.vue';

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
	e:'exp',
	t:'stamina',
	h:"hp",
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
		spellbook:Spellbook,
		adventure:Adventure,
		'vue-menu':Menu
	},
	data(){

		return {
			state:null,
			overItem:null,
			overElm:null
		};


	},
	created(){

		this.lastSave = null;

		/**
	 	* @property {Game} game
	 	*/
		this.game = Game;

		this.listen( 'sell', this.onSell );
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
		this.listen( 'learn', this.onLearn );

		// primary attack.
		this.listen( 'primary', this.onPrimary);

		this.loadSave();


	},
	methods:{

		gameLoaded() {

			console.log('gameLoaded()');
			this.state = Game.state;

			window.addEventListener('keydown',evt=>{
				this.keyDown( evt ); evt.stopPropagation(); }, false );

			this.unpause();

		},

		saveFile(e){

			if ( this.lastSave ) URL.revokeObjectURL( this.lastSave );

			try {
				let json = JSON.stringify( this.state );
				this.lastSave = new File( [json], 'arcanum.json', {type:"text/json;charset=utf-8"} );

				e.target.href = URL.createObjectURL( this.lastSave );

			} catch(ex) { console.error(ex); }

		},

		fileDrop(e){
			e.stopPropagation();
			e.preventDefault();

			e.target.classList.remove('hilite');
	
			const dt = e.dataTransfer;
			this.loadFile( dt.files );
			
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
		loadFile(files) {

			const file = files[0];
			if ( !file) return;
	
			const reader = new FileReader();
			reader.onload = (e)=>{

				this.loadData( e.target.result );

			}
			reader.readAsText( file );

		},

		loadSave() {

			let str = window.localStorage.getItem( 'gameData');
			if ( !str ) console.log('no data saved.');
			this.loadData( str );

		},

		loadData( text ){

			this.pause();

			let obj = text ? JSON.parse( text ) : null;
			this.game.load( obj ).then( this.gameLoaded );

		},

		save() {

			console.log('saving...');
			let store = window.localStorage;

			let json = JSON.stringify( this.state );
			console.log( json )
			store.setItem( 'gameData', json );

		},
		reset() {

			this.pause();

			// clear all save data.
			let store = window.localStorage;
			store.clear();

			this.game.reset().then( this.gameLoaded );

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
					let it = this.state.quickslots[num];
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

		onEquip( it ) { this.game.equip( it ); },

		onUnequip(slot, it){ this.game.unequip(slot, it) },

		/**
		 * Drop item from inventory.
		 * @param {Item} it - item to drop
		 */
		onDrop(it) { this.game.drop(it); },

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
			this.game.tryItem(it);
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
			<button @click="save">save</button>
			<button @click="loadSave">load</button>

			<a class="text-button" id="save-file" href="" download @click="saveFile" type="text/json">Get File</a>
			<!--<input type="file" name="[File]" accept="text/json" @change="fileDrop">-->
			<button id="drop-file" @drop="fileDrop" @dragover="fileDrag" @dragleave.capture.stop="dragOut">[Drop File]</button>

			<confirm @confirm="reset">reset</confirm>
			<dots v-if="state" :dots="state.player.dots" />
			<span class="load-message" v-if="!state">LOADING DATA...</span>
		</div>
		<div v-if="state" class="main">

		<!-- popup -->
		<itempopup :item="overItem" :elm="overElm" />

		<resources :items="state.resources"/>

		<vue-menu class="mid-view" :items="menuItems" active="sect_main">

		<template slot="sect_main">
		<actions :items="state.actions" />
		<upgrades :items="state.upgrades" />

		</template>
	
		<template slot="sect_player">
			<player />
		</template>

		<template slot="sect_house">
			<homes :state="state" />
		</template>
	
		<template slot="sect_raid">
			<adventure :state="state" />
		</template>

		<template slot="sect_skills">
			<skills :state="state"></skills>
		</template>

		<template slot="sect_spells">
			<spellbook :state="state" />
		</template>

		<template slot="sect_equip">

			<div class="inv-equip">
			<equip :equip="state.equip" />
			<inventory :inv="state.inventory" />
			</div>

		</template>

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

span.load-message {
	padding: 8px 8px 2px;
}

div.top-bar {
	display:flex;
	min-height: 24px;
	width:100%;
}

div.main {
	display:flex;
	flex-direction: row;
	flex-grow: 1;
	justify-content: space-between;
}

div.mid-view {
	flex-basis:35%;
	margin: 12px 8px;
}

div.inv-equip {
	display:flex;
	flex-direction: row;
	overflow-y: auto;
	height: 80vh;
	width:100%;
}

div.full {
	display:flex;
	flex-direction: column;
	min-width:500px;
	width: 98vw;
	margin: 0px;
}


</style>