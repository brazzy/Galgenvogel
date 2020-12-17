import { Level } from './level.js';
import { Player } from './player.js';
import { Monster } from './monster.js';

const NUM_MONSTERS = 10;
const FRAME_RATE = 5;

const LEVEL_WIDTH = 24;
const LEVEL_HEIGHT = 22;
const HEIGHT_OFFSET = 2;

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
	constructor() {
		this.level = null;
		this.player = new Player(FRAME_RATE);
		this.game = null;
		this.monsters = [];
	}
	
	init(game) {
		this.game = game;
		this.level = new Level(HARDCODED_LEVEL, HEIGHT_OFFSET);
		this.level.placeRandomly(this.player);
		this.level.setTarget(this.player);
		for(var i=0; i<NUM_MONSTERS; i++) {
			const monster = (i%4) ? new Monster(Color.Yellow, 2, 1, 100) : new Monster(Color.Orange, 5, 2, 10);				
			this.level.placeRandomly(monster);
			this.monsters.push(monster);
		}				
	}

	update(game) {
		this.player.paintStatus(this.game, LEVEL_WIDTH);
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
					alert("you lose!");				
					this.init();
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
			alert("you win!");
			location.reload();
		}
	}

	onDotClicked(x, y) {
		const target = this.level.grid[y-HEIGHT_OFFSET][x];
		if(target===this.player && this.player.magic > 0) {
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

var galgenvogel = new Galgenvogel();

let config = {
	create: galgenvogel.init.bind(galgenvogel),
	update: galgenvogel.update.bind(galgenvogel),
	onKeyPress: galgenvogel.onKeyPress.bind(galgenvogel),
	onDotClicked: galgenvogel.onDotClicked.bind(galgenvogel),
	frameRate: FRAME_RATE,
	clearGrid: false
};

let game = new Game(config);
game.run();