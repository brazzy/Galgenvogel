/**
 * Returns a random integer between 0 (inclusive) and maxExclusive.
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

/**
 * Durstenfeld algorithm taken from https://stackoverflow.com/a/12646864/16883
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export {randomInt, randomCoords, shuffle}