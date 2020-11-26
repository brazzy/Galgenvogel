const LEVEL_WIDTH=24;
const LEVEL_HEIGHT=24;
const level = [
[1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,1,1],
[1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1],
[1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,1,1,0,1,1],
[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1],
[1,1,1,1,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1,1],
[1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1],
[1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
[1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1],
[1,1,0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1],
[0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0],
[1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
[1,1,1,0,1,1,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,1,1,1],
[1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
[1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
[1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
[1,1,0,0,0,0,1,1,1,1,1,0,1,1,0,0,0,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1]
];

function create(game) {
  do {
	player = {
      x: Math.floor(Math.random()*LEVEL_WIDTH),
      y: Math.floor(Math.random()*LEVEL_HEIGHT),
    };
  } while ( hasWall(player.x, player.y))
  game.setDot(player.x, player.y, Color.Black);
}

function hasWall(x, y) {
	return level[y][x] === 1;
}

function update(game) {
  for(i=0; i<LEVEL_WIDTH; i++) {
	for(j=0; j<LEVEL_HEIGHT; j++) {
		if(hasWall(i,j)) {
			game.setDot(i, j, Color.Black);
		} else {
			game.setDot(i, j, Color.Gray);
		}	
	}
  }
	
  game.setDot(player.x, player.y, Color.Green);
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
};

let game = new Game(config);
game.run();