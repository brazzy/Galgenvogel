// Random level generator based on the approach described here: 
// https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/

import { step, transpose } from './level.js';
import { Direction } from './engine-types.js';
import { RANDOM } from './random.js';

const EMPTY = 0;
const WALL = 1;
const DIRECTIONS = [Direction.Up, Direction.Down, Direction.Right, Direction.Left];


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
				if(row[y]===EMPTY) {
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
			    level[x][y] = EMPTY;
			}
		}
	}

	toString() {
		return `(${this.x},${this.y} ${this.width}x${this.height})`;
	}

    static generate(levelWidth, levelHeight) {
        return new Room(RANDOM.int(levelWidth), RANDOM.int(levelHeight), RANDOM.int(5)+2, RANDOM.int(5)+2);
    }
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

    static empty(width, height) {
        const result = [];
        for(var x=0; x<width; x++) {
            result.push([]);
            for(var y=0; y<height; y++) {
                result[x].push(1);
            }
        }
        return new Wallgrid(result);
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

    toString() {
        var result = "\n";
        for(var y=0; y<this.height; y++) {
            result += '|';
            for(var x=0; x<this.width; x++) {
                switch(this.grid[x][y]) {
                    case EMPTY:
                        result += " ";
                        break;
                    case WALL:
                        result += "#";
                        break;
                    default:
                        result += this.grid[x][y];
                }
            }
            result += '|\n';
        }
        return result;
    }

    isEdge(x,y) {
        return x==0 || x==this.width-1 || y==0 || y==this.height-1;
    }

    tryAddRoom(room) {
        if(room.fitsWithMargin(this.grid)) {
            room.writeToLevel(this.grid);
        }
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
    	return this.grid[newX][newY] === EMPTY;
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
    	if(this.isEdge(newX, newY) && !this.isEdge(x,y)) {
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
            this.grid[x][y] = EMPTY;
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

    floodFill(x,y,toReplace,replacement) {
        if(toReplace === replacement) {
            return;
        }
        if(this.grid[x][y] === toReplace) {
            this.grid[x][y] = replacement;
            for(const direction of DIRECTIONS) {
                const [newX, newY] = this.step(x, y, direction);
                this.floodFill(newX, newY, toReplace, replacement);
            }
        }
    }

    findConnectors() {
        const result = [];
        for(var x=0; x<this.width; x++) {
            for(var y=0; y<this.height; y++) {
                if(this.grid[x][y] === WALL) {
                    const entry = [x,y];
                    for(const direction of DIRECTIONS) {
                        const [newX, newY] = this.step(x, y, direction);
                        if(this.grid[newX][newY] !== WALL) {
                            entry.push(newX);
                            entry.push(newY);
                        }
                    }
                    if(entry.length===6) {
                        if(this.grid[entry[2]][entry[3]] !== this.grid[entry[4]][entry[5]]) {
                            result.push(entry);
                        }
                    }
                }
            }
        }
        return result;
    }

    addRoomsAndCorridors(roomAttempts) {
        for(var i=0; i<roomAttempts; i++) {
            const room = Room.generate(this.width, this.height);
            this.tryAddRoom(room);
        }
        for(var x=0; x<this.width; x++) {
            for(var y=0; y<this.height; y++) {
                if(this.validateCorridorStart(x,y)) {
                    this.addCorridor(x,y)
                }
            }
        }
    }

    openConnection(x,y,x1,y1,x2,y2) {
        if(this.grid[x][y] !== WALL) {
            throw "tried to tear down non-existing wall at " + x + "," + y;
        }
        if(this.grid[x1][y1] === WALL) {
            throw "tried to connect wall at " + x1 + "," + y1;
        }
        if(this.grid[x2][y2] === WALL) {
            throw "tried to connect wall at " + x2 + "," + y2;
        }
        this.grid[x][y] = this.grid[x1][y1];
        this.floodFill(x2, y2, this.grid[x2][y2], this.grid[x1][y1])
    }

    paintAll() {
        var fillIndex = 2;
        for(var x=0; x<this.width; x++) {
            for(var y=0; y<this.height; y++) {
                if(this.grid[x][y] === EMPTY) {
                    this.floodFill(x,y,EMPTY,fillIndex++)
                }
            }
        }
    }

    connectAll() {
        this.paintAll();
        const connectors = this.findConnectors();
        RANDOM.shuffle(connectors);
        for(var i=0; i<connectors.length/10; i++) {
            this.openConnection(...connectors[i]);
        }
        for(var i=0; i<connectors.length-1; i++) {
            if(this.grid[connectors[i][2]][connectors[i][3]] !== this.grid[connectors[i][4]][connectors[i][5]]) {
                this.openConnection(...connectors[i]);
            }
        }
        const c = connectors[0];
        this.floodFill(c[0], c[1], this.grid[c[0]][c[1]], EMPTY);
    }

    /**
     * If we're unlucky then there can be areas without connectors (i.e. no other area
     * that can be reached by only removing a single wall. connectAll() will not work in
     * that case, and fixing it for all possible cases is quite hard. But since it's
     * rare, we just test for it and can start over in that case.
     */
    hasIsolated() {
        for(var x=0; x<this.width; x++) {
            for(var y=0; y<this.height; y++) {
                if(this.grid[x][y] > WALL) {
                    return true;
                }
            }
        }

        return false;
    }

}

export { Room, Wallgrid }