
const WALL = {
	color: Color.Black,
	spotTaken: true,
}

const EMPTY = {
	color: Color.Gray,
	spotTaken: false,
}

class Level {
	constructor(wallGrid, heightOffset){
		this.width = wallGrid[0].length;
		this.height = wallGrid.length;
		this.heightOffset = heightOffset;
		this.grid = [];
		for(var i=0; i<this.height; i++) {
			this.grid.push([]);
			for(var j=0; j<this.width; j++) {
				this.grid[i].push(wallGrid[i][j]==1 ? WALL : EMPTY);
			}
		}
	}
	
	placeRandomly(being) {
		var x,y;	
		do {
			y = Math.floor(Math.random()*this.height);
			x = Math.floor(Math.random()*this.width);
		} while (this.grid[y][x].spotTaken)
		this.grid[y][x] = being;
		being.x = x;
		being.y = y;
	}
	
	paint(game) {
		for(var i=0; i<this.height; i++) {
			for(var j=0; j<this.width; j++) {
				game.setDot(j, i+this.heightOffset, this.grid[i][j].color);
			}
		}
	}
	
	move(being, direction) {
		var newX = being.x;
		var newY = being.y;
		if (direction == Direction.Up) {
			newY = normalize(being.y-1, this.heigth);
		}
		if (direction == Direction.Down) {
			newY = normalize(being.y+1, this.height);
		}
		if (direction == Direction.Left) {
			newX = normalize(being.x-1, this.width);
		}
		if (direction == Direction.Right) {
			newX = normalize(being.x+1, this.width);
		}
		if(!this.grid[newY][newX].spotTaken) {
			this.grid[newY][newX] = being;
			this.grid[being.y][being.x] = EMPTY;
			being.x = newX;
			being.y = newY;
		}
	}
}


function normalize(value, max) {
	if(value > (max-1)) return value - max;
	if(value < 0) return value + max;
	return value;
}

export {Level}