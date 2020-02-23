import {cloneClass} from 'objecty';

/**
 * @property {Map.<string,GData>} NpcItems - clone of base game data used by Npcs
 * without modifiers, player effects etc.
 */
//export const NpcItems = new Map();

/*const MakeNpcItem = (p,data)=>{

	let t;

	if ( data.constructor ) {
		//console.log('using constr: ' + data.constructor.name );
		t = new data.constructor( cloneClass( data.template || data ) );
	} else {
		//console.log('no constructor: ' + p );
		t = cloneClass( data.template || data );
	}

	if ( t === null || t === undefined ) {
		console.log('NPC: Cant create: ' + p );
		t = data;
	}

	NpcItems.set( p, t );
	return t;

}*/

/**
 * Proxy GameState for Npcs
 */
export class NpcState {

	constructor( gs, caster){

		this.state = gs;
		this.self = caster;

		this.npcItems = new Map();


	}

	get raid(){return this.state.raid;}

	//get player(){return this.self; }

	nextId(id){
		return this.state.nextId(id);
	}

	getSlot(id, type) {
		return null;
	}

	setSlot(slot, v){
		return;
	}

	findInstance(id){
		return null;
	}

	getUnique(id){return this.state.getUnique(id)}

	getMaterial(id) { return this.state.getMaterial(id)}

	findData(id, any=false) {
		return this.getData(p);
	}

	hasUnique(id){return false}



	/**
	 *
	 * @param {string} p
	 */
	getData( p ){

		// appears to be check for special variables defined on state directly;
		// e.g. raid, explore. @todo many issues with this.
		if ( this.state[p] ) return this.state[p];

		let it = this.npcItems.get(p);
		if ( it !== undefined ) return it;

		if ( p === 'self' ) return this.self;
		else if ( p === 'player' ) return this.state.player;

		it = this.state.getData(p);
		if ( it ) {

			if ( it.isRecipe ) return it;
			//console.log('NEW NPC ITEM: ' + p + ': ' + it );
			return this.makeNpcItem( p, it );

		} else console.log('item not found: ' + p );

		return null;

	}

	makeNpcItem( p, data ){

		let t;

		//console.log('MAKE NPC ITEM: ' + data.id );

		if ( data.constructor ) {
			//console.log('using constr: ' + data.constructor.name );
			t = new data.constructor( cloneClass( data.template || data ) );
		} else {
			//console.log('no constructor: ' + p );
			t = cloneClass( data.template || data );
		}

		if ( t === null || t === undefined ) {
			console.log('NPC: Cant create: ' + p );
			t = data;
		}

		this.npcItems.set( p, t );
		return t;
	}

}