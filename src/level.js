import { Color, Direction } from './engine-types.js';

// needed to display stats, so level height must be 2 smaller than grid height.
const HEIGHT_OFFSET = 2;

const WALL = {
	color: Color.Black,
	spotTaken: true,
}

const EMPTY = {
	color: Color.Gray,
	spotTaken: false,
}

/**
 * For transposing hardcoded levels so they look natural,
 * and test inputs to test more cases.
 */
function transpose(level) { 
	if(level.length == 0) {
		return [];
	}
	return level[0].map((x,i) => level.map(x => x[i]));
}

class Level {
	/**
	 * First parameter is the level shape as an int array, with 0=empty and 1=wall.
	 */
	constructor(wallGrid, random){
		this.height = wallGrid[0].length;
		this.width = wallGrid.length;
		this.heightOffset = HEIGHT_OFFSET; // workaround so we can change it, see level.test.js
		this.random = random; // workaround so we can mock it, see level.test.js
		this.grid = [];
		this.targetDistances = [];
		for(var x=0; x<this.width; x++) {
			if(wallGrid[x].length != this.height) throw "irregular level shape in column " + x;
			this.grid.push([]);
			for(var y=0; y<this.height; y++) {
				if(![0, 1].includes(wallGrid[x][y])) throw `illegal value ${wallGrid[x][y]} at ${x},${y}`; 
				this.grid[x].push(wallGrid[x][y]==1 ? WALL : EMPTY);
			}
		}
	}
	
	placeRandomly(being) {
		var x,y;
		do {
			[x, y] = this.random(this.width, this.height);
		} while (this.grid[x][y].spotTaken)
		this.grid[x][y] = being;
		being.x = x;
		being.y = y;
	}
	
	remove(being) {
		this.grid[being.x][being.y] = EMPTY;
	}
	
	get(x,y) {
		return this.grid[x][y-HEIGHT_OFFSET];
	}
	
	paint(game) {
		for(var x=0; x<this.width; x++) {
			for(var y=0; y<this.height; y++) {
				game.setDot(x, y+this.heightOffset, this.grid[x][y].color);
			}
		}
	}
	
	setTarget(player) {
		const result = [];
		for(var x=0; x<this.width; x++) {
			result.push([]);
			for(var y=0; y<this.height; y++) {
				result[x].push(this.grid[x][y]===WALL ? NaN : +Infinity);
			}
		}

		result[player.x][player.y] = 0;
		const toProcess = [[player.x, player.y]];
		while(toProcess.length > 0) {
			const [x,y] = toProcess.pop();
			const currentDistance = result[x][y];
			for(const direction of [Direction.Up, Direction.Down, Direction.Right, Direction.Left]) {
				const [nextX, nextY] = step(x, y, this.width, this.height, direction);
				if(result[nextX][nextY] > currentDistance+1) {
					result[nextX][nextY] = currentDistance+1;
					toProcess.push([nextX, nextY]);					
				}
			}
		}
		this.targetDistances = result;
	}
	
	/**
	 * Returns null if move was successful, blocking entity otherwise
	 */
	move(being, direction) {
		const [x, y] = step(being.x, being.y, this.width, this.height, direction);
		if(this.grid[x][y].spotTaken) {
			return this.grid[x][y];
		} else {
			this.remove(being);
			this.grid[x][y] = being;
			being.x = x;
			being.y = y;
			return null;
		}
	}
	
	distanceToTarget(being) {
		return this.targetDistances[being.x][being.y];
	}
	
	/**
	 * Returns null if move was successful, blocking entity otherwise
	 */
	moveTowardsTarget(being) {
		const currentDistance = this.targetDistances[being.x][being.y];
		for(const direction of [Direction.Up, Direction.Down, Direction.Right, Direction.Left]) {
			const [nextX, nextY] = step(being.x, being.y, this.width, this.height, direction);
			if(this.targetDistances[nextX][nextY] < currentDistance) {
				return this.move(being, direction);
			}
		}
	}
}

function step(x, y, width, height, direction) {
	if (direction == Direction.Up) {
		y = normalize(y-1, height);
	}
	if (direction == Direction.Down) {
		y = normalize(y+1, height);
	}
	if (direction == Direction.Left) {
		x = normalize(x-1, width);
	}
	if (direction == Direction.Right) {
		x = normalize(x+1, width);
	}
	return [x, y];
}
		

function normalize(value, max) {
	if(value > (max-1)) return value - max;
	if(value < 0) return value + max;
	return value;
}

export {Level, HEIGHT_OFFSET, transpose, step}