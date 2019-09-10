console.log('cheats export');

var cheats;

if ( __DIST ) {
	cheats = {};

} else {

	const cheatKeys = {
		b: 'herbs',
		g: 'gold',
		s: 'scrolls',
		e: 'exp',
		t: 'stamina',
		h: "hp",
		k: 'sp',
		m: 'mana',
		c: 'codices',
		a: 'arcana',
		r: 'research'
	};

 cheats = {

	created() {

		window.addEventListener('keydown', e => {
			if (e.repeat) return;
			this.cheatKey(e);
		}, false);

	},

	methods: {

		cheatKey(e) {

			if (!this.runner) return;

			let key = e.key.toLowerCase();
			let targ = cheatKeys[key];

			if (key === 'p') {
				if (this.state.curAction && this.state.curAction.length) {
						this.state.curAction.exp = this.state.curAction.length - 0.01;
				}
				e.stopPropagation();
			}

			if ( targ ) {
				if (e.shiftKey) this.state.addMax( targ );
				else {
					let it = this.state.getData( targ );
					if (it.locked) it.locked = false;
					this.game.fillItem( targ );
				}
				e.stopPropagation();
			}

		}

	}

}
}

export default cheats;