function randomInt(maxExclusive) {
	return Math.floor(Math.random()*maxExclusive);
}

function randomCoords(width, height) {
	return [randomInt(width), randomInt(height)];
}

export {randomInt, randomCoords}