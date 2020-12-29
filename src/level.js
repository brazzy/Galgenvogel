import { Color, Direction } from './engine-types.js';
import { randomCoords } from './random.js';

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
		this.randomCoords = randomCoords; // workaround so we can mock it, see level.test.js
		this.grid = [];
		this.targetDistances = [];
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
			[x, y] = this.randomCoords(this.width, this.height);
		} while (this.grid[y][x].spotTaken)
		this.grid[y][x] = being;
		being.x = x;
		being.y = y;
	}
	
	remove(being) {
		this.grid[being.y][being.x] = EMPTY;
	}
	
	paint(game) {
		for(var i=0; i<this.height; i++) {
			for(var j=0; j<this.width; j++) {
				game.setDot(j, i+this.heightOffset, this.grid[i][j].color);
			}
		}
	}
	
	setTarget(player) {
		const result = [];
		for(var i=0; i<this.height; i++) {
			result.push([]);
			for(var j=0; j<this.width; j++) {
				result[i].push(this.grid[i][j]===WALL ? NaN : +Infinity);
			}
		}

		result[player.y][player.x] = 0;
		const toProcess = [[player.x, player.y]];
		while(toProcess.length > 0) {
			const [x,y] = toProcess.pop();
			const currentDistance = result[y][x];
			for(const direction of [Direction.Up, Direction.Down, Direction.Right, Direction.Left]) {
				const [nextX, nextY] = this.step(x, y, direction);
				if(result[nextY][nextX] > currentDistance+1) {
					result[nextY][nextX] = currentDistance+1;
					toProcess.push([nextX, nextY]);					
				}
			}
		}
		this.targetDistances = result;
	}
	
	step(x, y, direction) {
		if (direction == Direction.Up) {
			y = normalize(y-1, this.height);
		}
		if (direction == Direction.Down) {
			y = normalize(y+1, this.height);
		}
		if (direction == Direction.Left) {
			x = normalize(x-1, this.width);
		}
		if (direction == Direction.Right) {
			x = normalize(x+1, this.width);
		}
		return [x, y];
	}
		
	/**
	 * Returns null if move was successful, blocking entity otherwise
	 */
	move(being, direction) {
		const [x, y] = this.step(being.x, being.y, direction);
		if(this.grid[y][x].spotTaken) {
			return this.grid[y][x];
		} else {
			this.remove(being);
			this.grid[y][x] = being;
			being.x = x;
			being.y = y;
			return null;
		}
	}
	
	distanceToTarget(being) {
		return this.targetDistances[being.y][being.x];
	}
	
	/**
	 * Returns null if move was successful, blocking entity otherwise
	 */
	moveTowardsTarget(being) {
		const currentDistance = this.targetDistances[being.y][being.x];
		for(const direction of [Direction.Up, Direction.Down, Direction.Right, Direction.Left]) {
			const [nextX, nextY] = this.step(being.x, being.y, direction);
			if(this.targetDistances[nextY][nextX] < currentDistance) {
				return this.move(being, direction);
			}
		}
	}
}


function normalize(value, max) {
	if(value > (max-1)) return value - max;
	if(value < 0) return value + max;
	return value;
}

export {Level}