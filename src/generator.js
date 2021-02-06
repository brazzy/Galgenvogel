// NOTE: This is incomplete and unneccessarily complicated, will abandon this and try
// the approach described here: https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/


function generateLevel(width, height, rooms, connections, randomCoords) {
	const result = [];
	for(var x=0; x<width; x++) {
		result.push(new Array(height));
		result[x].fill(1);
	}
	
	for(var i=0; i<rooms; i++) {
		[x,y,width,height] = findLargestFullSpace(result);
		if(width<2 || height<2) {
			break;
		}
		[roomX, roomY] = randomCoords(width-1, height-1);
		roomX += x;
		roomY += y;
		
		// TODO
	}
	
	// TODO connections
}

const MIN_GRID = [[1,1,1,1],
				  [1,1,1,1],
				  [1,1,1,1],
				  [1,1,1,1]];

function findLargestPossibleRoom(grid) {
	const width = grid.length;
	if(width<4) {
		throw "grid is smaller than 4x4";
	}
	const height = grid[0].length;
	if(height<4) {
		throw "grid is smaller than 4x4";
	}
	for(var x=0; x<width; x++) {
		if(grid[x].length != height) throw "irregular grid";
		for(var y=0; y<height; y++) {
			if(![0, 1].includes(grid[x][y])) throw "only 0 and 1 allowed"; 
		}
	}
	
	// base case for recursion
	if (width==4 && height==4) {
		if(grid.findIndex(row => row.includes(0)) != -1){
			return [0,0,0,0];// oh, problem! This lacks information because a single candidate square could be part of a room!		
		} else {
			return [1,1,2,2];
		}	
	}

	return [0,0,0,0];
	
	// TODO
	// irgendwie rekursiv
	// f(4x4) is base case, kleinstes sinnvolles Ergebnis ist 2x2
	// f(AxB) = f(A-1xB) gemerged mit f(AxB-1) und jeweils Möglichkeit zum Wachstum
	// Kandidaten sind immer der größte Raum der nicht mehr wachsen kann und alle die noch wachsen können
}

export {generateLevel, findLargestPossibleRoom}