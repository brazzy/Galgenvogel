// Random level generator based on the approach described here: 
// https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/

import { step, transpose } from './level.js';
import { Direction } from './engine-types.js';

class Room {
	constructor(x, y, width, height){
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
	}

	fitsInto(level) {
		if(this.x<0 || this.y<0) return false;
		if(level.length < this.x+this.width) {
			return false;
		}
		for(var x=this.x; x<this.x+this.width; x++) {
			var row = level[x];
			if(row.length < this.y+this.height) {
				return false;
			}
			for(var y=this.y; y<this.y+this.height; y++) {
				if(row[y]===0) {
					return false;
				}
			}
		}

		return true;
	}

	fitsWithMargin(level) {
	    const withMargin = new Room(this.x-1, this.y-1, this.width+2, this.height+2);
	    return withMargin.fitsInto(level);
	}

	writeToLevel(level) {
		for(var x=this.x; x<this.x+this.width; x++) {
			for(var y=this.y; y<this.y+this.height; y++) {
			    level[x][y] = 0;
			}
		}
	}

	toString() {
		return `(${this.x},${this.y} ${this.width}x${this.height})`;
	}
}

function generateRoom(levelWidth, levelHeight, randomInt) {
    return new Room(randomInt(levelWidth), randomInt(levelHeight), randomInt(5)+2, randomInt(5)+2);
}

function generateLevel(width, height, roomAttempts, randomInt) {
    const result = [];
    for(var x=0; x<width; x++) {
        result.push([]);
        for(var y=0; y<height; y++) {
            result[x].push(1);
        }
    }
    for(var i=0; i<roomAttempts; i++) {
        const room = generateRoom(width, height, randomInt);
        if(room.fitsWithMargin(result)) {
            room.writeToLevel(result);
        }
    }
    return result;
}

class Wallgrid {
	/**
	 * Parameter is the level shape as an int array, with 0=empty and 1=wall.
	 */
	constructor(array2d){
        this.grid = array2d;
        this.height = this.grid[0].length;
        this.width = this.grid.length;
    }

    static transposed(array2d) {
        return new Wallgrid(transpose(array2d));
    }

    invert() {
        const result = [];
        for(var x=0; x<this.width; x++) {
            result.push([]);
            for(var y=0; y<this.height; y++) {
                result[x].push(this.grid[this.width-x-1][this.height-y-1]);
            }
        }
        this.grid = result;
    }

    print() {
        var result = "\n";
        for(var x=0; x<this.width; x++) {
            result += '|';
            for(var y=0; y<this.height; y++) {
                result += this.grid[x][y] == 0 ? " " : "#";
            }
            result += '|\n';
        }
        return result;
    }

    step(x, y, ...directions) {
        return step(x, y, this.width, this.height, ...directions);
    }

    validateCorridorStart(x, y) {
    	const room = new Room(x,y,1,1);
    	return room.fitsWithMargin(this.grid);
    }

    blockedMove(x, y, ...directions) {
    	const [newX, newY] = this.step(x,y, ...directions);
    	return this.grid[newX][newY] === 0;
    }

    blockedDirection(x, y, direction) {
        if (direction == Direction.Up) {
            return this.blockedMove(x, y, Direction.Up)
                || this.blockedMove(x, y, Direction.Up, Direction.Left)
                || this.blockedMove(x, y, Direction.Up, Direction.Right)
        } else if (direction == Direction.Down) {
            return this.blockedMove(x, y, Direction.Down)
                || this.blockedMove(x, y, Direction.Down, Direction.Left)
                || this.blockedMove(x, y, Direction.Down, Direction.Right)
        } else if (direction == Direction.Left) {
            return this.blockedMove(x, y, Direction.Left)
                || this.blockedMove(x, y, Direction.Left, Direction.Up)
                || this.blockedMove(x, y, Direction.Left, Direction.Down)
        } else if (direction == Direction.Right) {
            return this.blockedMove(x, y, Direction.Right)
                || this.blockedMove(x, y, Direction.Right, Direction.Up)
                || this.blockedMove(x, y, Direction.Right, Direction.Down)
        } else {
            throw new Error("Unknown direction: " + direction);
        }
    }

    validCorridorDirection(x, y, direction) {
    	if((x==0 || x==this.width-1) && (direction==Direction.Up || direction==Direction.Down)){
    		return false;
    	}
    	if((y==0 || y==this.height-1) && (direction==Direction.Left || direction==Direction.Right)){
    		return false;
    	}
    	if(this.blockedDirection(x, y, direction)) {
    	    return false;
    	}
    	var [newX, newY] = this.step(x,y,direction);
    	if((newX==0 || newX==this.width-1 || newY==0 || newY==this.height-1) && !(x==0 || x==this.width-1 || y==0 || y==this.height-1)) {
            [newX, newY] = this.step(newX,newY,direction);
            return !this.blockedDirection(newX, newY, direction);
    	} else {
        	return !this.blockedDirection(newX, newY, direction);
    	}
    }

    validCorridorDirections(x, y) {
        return [Direction.Up, Direction.Right, Direction.Down, Direction.Left]
            .filter(dir => this.validCorridorDirection(x, y, dir));
    }

    addCorridor(x, y) {
        var dir = Direction.Up;
        while(true) {
            this.grid[x][y] = 0;
            if(!this.validCorridorDirection(x, y, dir)) {
                const dirs = this.validCorridorDirections(x, y);
                if(dirs.length == 0) {
                    return;
                } else {
                    dir = dirs[0];
                }
            }
            [x, y] = this.step(x, y, dir);
        }
    }

}

export { Room, Wallgrid, generateLevel, generateRoom }