import { Level } from './level.js';
import { Player } from './player.js';
import { Monster } from './monster.js';
import { randomCoords } from './random.js';

const FRAME_RATE = 5;

// needed to display stats, so level height must be 2 smaller than grid height.
const HEIGHT_OFFSET = 2;

const NUM_MONSTERS = 10;

// grid size of 24 is the engine default, we stick with it for now
const HARDCODED_LEVEL = [
[1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,1,1],
[1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1],
[1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,1,1,0,1,1],
[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1],
[1,1,1,1,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1,1],
[1,0,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1],
[1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
[1,1,0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1],
[0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0],
[1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
[1,1,1,0,1,1,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,1,1,1],
[1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
[1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
[1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
[1,1,0,0,0,0,1,1,1,1,1,0,1,1,0,0,0,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1]
];

function finishLevel(won) {
	if(won) {		
		alert("you win!");
	} else {
		alert("you lose!");
		this.player.init();
	}
	this.init(this.game);
}

class Galgenvogel {
	constructor(levelGenerator = () => HARDCODED_LEVEL, numMonsters = NUM_MONSTERS, random = randomCoords, finish = finishLevel) {
		this.level = null;
		this.levelGenerator = levelGenerator;
		this.finish = finish;
		this.player = new Player(FRAME_RATE);
		this.game = null;
		this.random = random;
		this.numMonsters = numMonsters;
		this.monsters = [];
	}
	
	init(game) {
		this.game = game;
		this.monsters = [];
		this.level = new Level(this.levelGenerator(), HEIGHT_OFFSET, this.random);
		this.level.placeRandomly(this.player);
		this.level.setTarget(this.player);
		for(var i=0; i<this.numMonsters; i++) {
			const monster = (i%4) ? new Monster(Color.Yellow, 2, 1, 100) : new Monster(Color.Orange, 5, 2, 10);				
			this.level.placeRandomly(monster);
			this.monsters.push(monster);
		}				
	}

	update(game) {
		this.player.paintStatus(this.game, this.level.width);
		this.level.paint(this.game);
	}

	onKeyPress(direction) {
		if(!this.player.move(this.level, direction)) {
			return;
		}
		for(var i = this.monsters.length-1; i>=0; i--){
			const monster = this.monsters[i];
			if(monster.health > 0){
				monster.move(this.level);
				if(this.player.health <= 0) {
					this.finish(false);
				}
			} else {
				this.remove(monster);
			}
		}
	}

	remove(monster) {
		this.level.remove(monster);
		const index = this.monsters.indexOf(monster);
		this.monsters.splice(index, 1);
		if(this.monsters.length==0) {
			this.finish(true);
		}
	}

	onDotClicked(x, y) {
		if(this.player.magic > 0) {
			const target = this.level.grid[y-HEIGHT_OFFSET][x];
			if(target===this.player) {
				this.level.remove(this.player);
				this.level.placeRandomly(this.player);
				this.player.magic--;
			} else if (target.health){
				target.health-=2;
				this.player.magic--;
				if(target.health <=0) {
					this.remove(target);
				}
			}
		}
	}
}

export {Galgenvogel, FRAME_RATE}