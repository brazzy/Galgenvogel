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


const monsters = [];


function create(game) {
	game.level = new Level(HARDCODED_LEVEL, HEIGHT_OFFSET);
	game.player = new Player(FRAME_RATE);
	game.level.placeRandomly(game.player);
	game.level.setTarget(game.player);
	for(var i=0; i<NUM_MONSTERS; i++) {
		const monster = new Monster();
		game.level.placeRandomly(monster);
		monsters.push(monster);
	}		
}

function update(game) {
	game.player.paintStatus(game, LEVEL_WIDTH);
	game.level.paint(game);
}

function onKeyPress(direction) {
	if(!game.player.move(game.level, direction)) {
		return;
	}
	for(var i = monsters.length-1; i>=0; i--){
		const monster = monsters[i];
		if(monster.health > 0){
			monster.move(game.level);
			if(game.player.health <= 0) {
				alert("you lose!");				
				location.reload();
			}
		} else {
			remove(monster);
		}
	}
}

function remove(monster) {
	game.level.remove(monster);
	const index = monsters.indexOf(monster);
	monsters.splice(index, 1);
	if(monsters.length==0) {
		alert("you win!");
		location.reload();
	}
}

function onDotClicked(x, y) {
	const target = game.level.grid[y-HEIGHT_OFFSET][x];
	if(target===game.player && game.player.magic > 0) {
		game.level.remove(game.player);
		game.level.placeRandomly(game.player);
		game.player.magic--;
	} else if (target.health){
		target.health-=2;
		game.player.magic--;
		if(target.health <=0) {
			remove(target);
		}
	}
}

let config = {
	create: create,
	update: update,
	onKeyPress: onKeyPress,
	onDotClicked: onDotClicked,
	frameRate: FRAME_RATE,
	clearGrid: false
};

let game = new Game(config);
game.run();