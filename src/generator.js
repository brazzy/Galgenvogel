// Random level generator based on the approach described here: 
// https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/

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
    	debugger;
	    const withMargin = new Room(this.x-1, this.y-1, this.width+2, this.height+2);
	    return withMargin.fitsInto(level);
	}

	toString() {
		return `(${this.x},${this.y} ${this.width}x${this.height})`;
	}
}

//function generateLevel(width, height, roomAttempts, randomCoords) {
//}



export {Room}