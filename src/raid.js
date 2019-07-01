/**
 * Represents an active dungeon raid.
 */
export default class Raid {

	get id() { return this.dungeon.id;}
	get name() { return this.dungeon.name; }

	get cost() { return this.dungeon ? this.dungeon.cost : null; }

	constructor( vars=null ) {

		if ( vars ) Object.assign(vars, this);

		this.active = this.active || false;
		this.dungeon = this.dungeon || null;
		this.enemy = this.enemy || null;
		this.playerTimer = this.playerTimer || 0;
		this.enemyTimer = this.enemyTimer || 0;

		this.playerAct = '';
		this.enemyAct = '';

	}

	initState( gameState ) {

		this.state = gameState;
		this.player = gameState.player;
		this.dungeon = gameState.dungeon;

	}

	update(dt) {

		if ( this.active === false ) return;
		if ( this.dungeon == null ) {
			this.active = false;
			return;
		}

		if ( this.enemy == null ) this.setEnemy( this.dungeon.getEnemy() );

		//this.state.items.stamina.value -= this.dungeon.fatigue*dt;

		this.playerTimer -= dt;
		if ( this.playerTimer <= 0 ) {

			this.playerTimer += this.player.delay;
			this.playerAttack();

		}

		if ( this.enemy != null ) {

			this.enemyTimer -= dt;
			if ( this.enemyTimer <= 0 ) {

				this.enemyTimer += this.enemy.delay;
				this.enemyAttack();

			}
		}

	}

	playerAttack() {

		let atk = Math.random()*this.player.attack;
		
		//console.log('player attack: ' + atk );

		if ( atk >= Math.random()*this.enemy.defense ) {

			let dmg = this.player.damage.value;

			this.playerAct = this.enemy.name + ' hit: ' + dmg.toFixed(1);

			this.enemy.hp -= dmg;
			if ( this.enemy.hp <= 0 ) this.enemyDied();

		} else {
			this.playerAct = this.player.name + ' misses';
		}

	}

	enemyAttack() {

		let atk = Math.random()*this.enemy.attack;
		//console.log('monster attack: ' + atk);

		if ( atk >= Math.random()*this.player.defense ) {

			let dmg = this.enemy.min +
				Math.round( Math.random()*(this.enemy.max-this.enemy.min) );

			this.enemyAct = this.player.name + ' hit: ' + dmg.toFixed(1);

			this.player.hp -= dmg;
			if ( this.player.hp <= 0 ) this.playerDied();

		} else {
			this.enemyAct = this.enemy.name + ' misses';
		}

	}

	playerDied() {
		console.log('player died');
		this.state.curAction = this.state.getItem('rest');
	}

	enemyDied() {

		console.log('enemey died');
		this.player.exp += this.enemy.level;
		this.dungeon.progress++;

		this.enemyAct = this.enemy.name + ' slain';
		this.enemy = null;

		if ( this.dungeon.progress === this.dungeon.length ) {
			this.raidDone( this.dungeon );
		}

	}

	raidDone() {

		this.player.exp += 5*this.dungeon.progress;
		this.dungeon = null;
		this.state.curAction = null;

	}

	setDungeon( d ) {
		this.dungeon = d;
		if ( d.progress >= d.length ) d.progress = 0;
		this.active = true;
	}

	setEnemy(e) {

		this.enemy = Object.assign( {}, e );
		this.enemyTimer += this.enemy.delay;
		this.playerTimer += this.player.delay;

	}

}