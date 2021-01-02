import { Galgenvogel, FRAME_RATE } from './Galgenvogel.js';

var galgenvogel = new Galgenvogel();

let config = {
	create: galgenvogel.init.bind(galgenvogel),
	update: galgenvogel.update.bind(galgenvogel),
	onKeyPress: galgenvogel.onKeyPress.bind(galgenvogel),
	onDotClicked: galgenvogel.onDotClicked.bind(galgenvogel),
	frameRate: FRAME_RATE,
	clearGrid: false
};

let game = new Game(config);
game.run();
