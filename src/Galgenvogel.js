import { Level, HEIGHT_OFFSET, transpose } from './level.js';
import { Player } from './player.js';
import { Monster } from './monster.js';
import { randomCoords } from './random.js';
import { Color, Direction } from './engine-types.js';

const FRAME_RATE = 5;

const NUM_MONSTERS = 10;

// grid size of 24 is the engine default, we stick with it for now.
// content is transposed to make it easier to edit visually.
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

class Galgenvogel {
	constructor(levelGenerator = () => transpose(HARDCODED_LEVEL), numMonsters = NUM_MONSTERS, random = randomCoords) {
		this.level = null;
		this.levelGenerator = levelGenerator;
		this.player = new Player(FRAME_RATE);
		this.random = random;
		this.numMonsters = numMonsters;
		this.monsters = [];
	}
	
	init() {
		this.monsters = [];
		this.level = new Level(this.levelGenerator(), this.random);
		this.level.placeRandomly(this.player);
		this.level.setTarget(this.player);
		for(var i=0; i<this.numMonsters; i++) {
			const monster = this.generateMonster(i);				
			this.level.placeRandomly(monster);
			this.monsters.push(monster);
		}				
	}

	generateMonster(index) {
		return (index%4) ? new Monster(Color.Yellow, 2, 1, 100) : new Monster(Color.Orange, 5, 2, 10);		
	}

	finishLevel(won) {
		if(won) {		
			alert("you win!");
		} else {
			alert("you lose!");
			this.player.init();
		}
		this.init();
	}

	update(game) {
		this.player.paintStatus(game, this.level.width);
		this.level.paint(game);
	}

	onKeyPress(direction) {
		if(this.player.move(this.level, direction)) {
			this.moveMonsters();
		}
	}
	
	moveMonsters() {
		for(var i = this.monsters.length-1; i>=0; i--){
			const monster = this.monsters[i];
			if(monster.isAlive()){
				monster.move(this.level);
				if(!this.player.isAlive()) {
					this.finishLevel(false);
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
			this.finishLevel(true);
		}
	}

	onDotClicked(x, y) {
		if(this.player.cast(this.level, x, y)) {
			this.moveMonsters();
		}
	}
}

export {Galgenvogel, FRAME_RATE, NUM_MONSTERS}