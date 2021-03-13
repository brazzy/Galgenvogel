// Random level generator based on the approach described here: 
// https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/

import { step } from './level.js';
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

function validateCorridorStart(level, x, y) {
	const room = new Room(x,y,1,1);
	return room.fitsWithMargin(level);
}

function blockedMove(level, x, y, ...directions) {
	const width = level.length;
	const height = level[0].length;
	const [newX, newY] = step(x,y,width,height, ...directions);
	return level[newX][newY] === 0;
}

function blockedDirection(level, x, y, direction) {
	const width = level.length;
	const height = level[0].length;
    if (direction == Direction.Up) {
        return blockedMove(level, x, y, Direction.Up)
            || blockedMove(level, x, y, Direction.Up, Direction.Left)
            || blockedMove(level, x, y, Direction.Up, Direction.Right)
    } else if (direction == Direction.Down) {
        return blockedMove(level, x, y, Direction.Down)
            || blockedMove(level, x, y, Direction.Down, Direction.Left)
            || blockedMove(level, x, y, Direction.Down, Direction.Right)
    } else if (direction == Direction.Left) {
        return blockedMove(level, x, y, Direction.Left)
            || blockedMove(level, x, y, Direction.Left, Direction.Up)
            || blockedMove(level, x, y, Direction.Left, Direction.Down)
    } else if (direction == Direction.Right) {
        return blockedMove(level, x, y, Direction.Right)
            || blockedMove(level, x, y, Direction.Right, Direction.Up)
            || blockedMove(level, x, y, Direction.Right, Direction.Down)
    } else {
        throw new Error("Unknown direction: " + direction);
    }
}

function validCorridorDirection(level, x, y, direction) {
	const width = level.length;
	const height = level[0].length;
	if((x==0 || x==width-1) && (direction==Direction.Up || direction==Direction.Down)){
		return false;
	}
	if((y==0 || y==height-1) && (direction==Direction.Left || direction==Direction.Right)){
		return false;
	}
	if(blockedDirection(level, x, y, direction)) {
	    return false;
	}
	var [newX, newY] = step(x,y,width,height,direction);
	if((newX==0 || newX==width-1 || newY==0 || newY==height-1) && !(x==0 || x==width-1 || y==0 || y==height-1)) {
        [newX, newY] = step(newX,newY,width,height,direction);
        return !blockedDirection(level, newX, newY, direction);
	} else {
    	return !blockedDirection(level, newX, newY, direction);
	}
}

function validCorridorDirections(level, x, y) {
    return [Direction.Up, Direction.Right, Direction.Down, Direction.Left]
        .filter(dir => validCorridorDirection(level, x, y, dir));
}

function addCorridor(level, x, y) {
	const width = level.length;
	const height = level[0].length;
    var dir = Direction.Up;
    while(true) {
        level[x][y] = 0;
        if(!validCorridorDirection(level, x, y, dir)) {
            const dirs = validCorridorDirections(level, x, y);
            if(dirs.length == 0) {
                return;
            } else {
                dir = dirs[0];
            }
        }
        [x, y] = step(x, y, width, height, dir);
    }
}

export { Room, generateLevel, generateRoom, validateCorridorStart, validCorridorDirection, validCorridorDirections, blockedDirection, blockedMove, addCorridor }