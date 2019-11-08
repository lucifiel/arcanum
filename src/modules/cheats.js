import Game from '../game';

var cheats;

if ( false ) {

	cheats = {};

} else {

	const cheatKeys = {
		b:'herbs',
		g:'gold',
		s:'scrolls',
		e:'exp',
		t:'stamina',
		h:"hp",
		k:'sp',
		m:'mana',
		c:'codices',
		a:'arcana',
		r:'research',
		w:'wizardhall'
	};

 cheats = {

	created() {

		window.addEventListener('keydown', e => {
			if (e.repeat) return;
			this.cheatKey(e);
		}, false);

		this.enabled = false;
		this.code = 'bodias';
		this.input = '';
	},

	methods: {

		cheatKey(e) {

			if (!this.runner) return;

			let key = e.key.toLowerCase();

			if ( !this.enabled ) {
				this.testUnlock(key);
				return;
			}

			let targ = cheatKeys[key];

			if (key === 'p') {

				this.state.getData('runner').autoProgress();
				e.stopPropagation();

			} else if ( key ==='f') {

				this.fillAll();
				e.stopPropagation();

			} else if ( targ ) {
				if (e.shiftKey) this.state.addMax( targ );
				else {
					let it = this.state.getData( targ );
					if (it.locked) it.locked = false;
					Game.fillItem( targ );
				}
				e.stopPropagation();
			}

		},
		fillAll(){

			let res = this.state.resources;
			for( let p in res ){
				if ( p !== 'space' && !res[p].locked ){
					Game.fillItem( res[p] )
				}
			}
		},
		testUnlock(key){

			this.input += key;
			if ( this.input === this.code ) {

				console.warn('CHEATS ON');
				this.enabled = true;

			} else if ( this.input.length >= this.code.length ) {
				this.input = this.input.slice( 1+ this.input.length - this.code.length );
			}

		}

	}

}

}

export default cheats;