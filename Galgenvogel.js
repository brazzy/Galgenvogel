const LEVEL_WIDTH=24;
const LEVEL_HEIGHT=22;
const NUM_MONSTERS = 5;
const HEIGHT_OFFSET = 2;
const FRAME_RATE = 5;
const level = [
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
var player = {};

function create(game) {
  for(i=0; i<NUM_MONSTERS; i++) {
	  monsters.push(randomFreeSpot());
  }
  player = randomFreeSpot();
  player.color = Color.Green;
  player.colorCount = 0;
  player.health=3;
  player.maxHealth=FRAME_RATE;
  player.magic = 1;
  player.maxMagic=2;
  
  player.getColor = ()=>{
	  if(this.color === Color.Green) {
		  if(this.colorCount === 0) {
			  this.color = Color.Gray;
		  } else {
			  this.colorCount--;
		  }
	  } else {
		  this.color = Color.Green;		  
		  this.colorCount = FRAME_RATE;			  
	  }
	  return this.color;
  }
}

function randomFreeSpot() {
  var result = {};	
  do {
    result.x = Math.floor(Math.random()*LEVEL_WIDTH);
    result.y = Math.floor(Math.random()*LEVEL_HEIGHT);
  } while ( isTaken(result.x, result.y))
  return result;
}

function isTaken(x, y) {
	if(x==player.x && y==player.y) return true;
	for(monster of monsters) {
      if(x==monster.x && y==monster.y) return true;
	}
	return hasWall(x,y);
}

function hasWall(x, y) {
	return level[y][x] === 1;
}

function update(game) {
  for(i=0; i<LEVEL_WIDTH; i++) {
	for(j=0; j<LEVEL_HEIGHT; j++) {
		if(hasWall(i,j)) {
			game.setDot(i, j+HEIGHT_OFFSET, Color.Black);
		} else {
			game.setDot(i, j+HEIGHT_OFFSET, Color.Gray);
		}	
	}
  }
  for(monster of monsters) {
	game.setDot(monster.x, monster.y+HEIGHT_OFFSET, Color.Yellow);	  
  }
	
  game.setDot(player.x, player.y+HEIGHT_OFFSET, player.getColor());
  for(i=0; i<LEVEL_WIDTH; i++) {
	game.setDot(i, 1, Color.Black);	  
  }
  for(i=0; i<LEVEL_WIDTH; i++) {
	if(i<=player.maxHealth) {
	  game.setDot(i, 0, Color.Red);
	}
	if(i<=player.health) {
	  game.setDot(i, 0, Color.Orange);
	}

	if(LEVEL_WIDTH-i <= player.maxMagic) {
	  game.setDot(i, 0, Color.Indigo);
	}
	if(LEVEL_WIDTH-i <= player.magic) {
	  game.setDot(i, 0, Color.Blue);
	}
  }
}

function onKeyPress(direction) {
  var newX = player.x;
  var newY = player.y;
  if (direction == Direction.Up) {
    newY = normalize(player.y-1, LEVEL_HEIGHT);
  }
  if (direction == Direction.Down) {
    newY = normalize(player.y+1, LEVEL_HEIGHT);
  }
  if (direction == Direction.Left) {
    newX = normalize(player.x-1, LEVEL_WIDTH);
  }
  if (direction == Direction.Right) {
    newX = normalize(player.x+1, LEVEL_WIDTH);
  }
  if(!hasWall(newX, newY)) {
	player.x = newX;
	player.y = newY;
  }
}

function normalize(value, max) {
	if(value > (max-1)) return value - max;
	if(value < 0) return value + max;
	return value;
}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
  frameRate: FRAME_RATE,
  clearGrid: false
};

let game = new Game(config);
game.run();