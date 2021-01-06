/**
 * Returns array of random coordinates within a grid of the given width and height. Usage:
 * [x, y] = randomCoords(width, height);
 */
function randomInt(maxExclusive) {
	return Math.floor(Math.random()*maxExclusive);
}

/**
 * Returns a random coordinate within a grid of the given width and height as an [x,y] array. Usage:
 * [x, y] = randomCoords(width, height);
 */
function randomCoords(width, height) {
	return [randomInt(width), randomInt(height)];
}

export {randomInt, randomCoords}