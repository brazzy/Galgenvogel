import { Galgenvogel, NUM_MONSTERS, MONSTER_INCREASE } from '../src/Galgenvogel.js';
import { Color, Direction } from '../src/engine-types.js';
import { Monster } from '../src/monster.js';
import { Level, HEIGHT_OFFSET } from '../src/level.js';
import { HEAL_DELAY, HEALTH_START, HEALTH_MAX, MAGIC_START, MAGIC_MAX } from '../src/player.js';
import { jest } from '@jest/globals';
import { RANDOM } from '../src/random.js';

const NO_WALLS = [[0,0,0], [0,0,0], [0,0,0]];


beforeEach(() => {    
	jest.spyOn(window, 'alert').mockImplementation(() => {});
	RANDOM.reseed(42);
});
afterEach(() => {
    jest.clearAllMocks();
});

describe('smoketest', () => {	
	test('default initialization', () => {
		const gv = new Galgenvogel();
		gv.init();
		expect(gv.monsters.length).toBe(NUM_MONSTERS);
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.player.magic).toBe(MAGIC_START);
		expect(gv.level.width).toBe(24);
		expect(gv.level.height).toBe(24-HEIGHT_OFFSET);
		expect(gv.level.targetDistances.length).toBe(24);
		expect(gv.level.targetDistances[0].length).toBe(24-HEIGHT_OFFSET);
	});

	test('default paint', () => {
		const gv = new Galgenvogel();
		const mock = jest.fn();
		const game = {setDot: mock};
		gv.init();
		gv.update(game);
		expect(mock).toHaveBeenCalledTimes(24*24);
	});	
});

describe('movement', () => {
	
	test('basic', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords.mockReturnValue( [1,1] );
		const gv = new Galgenvogel(() => NO_WALLS, 0);

		gv.init();
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		
		gv.onKeyPress(Direction.Up);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(0);
		
		gv.onKeyPress(Direction.Down);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);

		gv.onKeyPress(Direction.Left);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(1);

		gv.onKeyPress(Direction.Right);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
	});

	test('walls', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords.mockReturnValue( [1,1] );
		const gv = new Galgenvogel(() => [[1,1,1], [1,0,1], [1,1,1]], 0);

		gv.init();
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		
		gv.onKeyPress(Direction.Up);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		
		gv.onKeyPress(Direction.Down);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);

		gv.onKeyPress(Direction.Left);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);

		gv.onKeyPress(Direction.Right);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
	});

	test('wraparound', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords.mockReturnValue( [0,0] );
		const gv = new Galgenvogel(() => NO_WALLS, 0);

		gv.init();
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		
		gv.onKeyPress(Direction.Up);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(2);
		
		gv.onKeyPress(Direction.Down);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);

		gv.onKeyPress(Direction.Left);
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(0);

		gv.onKeyPress(Direction.Right);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
	});

	test('wraparound blocked by walls up and left', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords.mockReturnValue( [0,0] );
		const gv = new Galgenvogel(() => [[0,0,1], [0,0,0], [1,0,0]], 0);

		gv.init();
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		
		gv.onKeyPress(Direction.Up);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		
		gv.onKeyPress(Direction.Left);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
	});

	test('wraparound blocked by walls down and right', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords.mockReturnValue( [2,2] );
		const gv = new Galgenvogel(() => [[0,0,1], [0,0,0], [1,0,0]], 0);

		gv.init();
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(2);
		
		gv.onKeyPress(Direction.Down);
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(2);
		
		gv.onKeyPress(Direction.Right);
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(2);
	});

	test('monster follows with limited perception range', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords
			 .mockReturnValueOnce( [0,0] )
			 .mockReturnValueOnce( [2,2] );
		const gv = new Galgenvogel(() => [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]], 1);
		gv.generateMonster = () => new Monster(Color.Orange, 1, 1, 2);

		gv.init();
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].x).toBe(2);
		expect(gv.monsters[0].y).toBe(2);
		
		// outside perception range
		gv.onKeyPress(Direction.Right);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(0);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].x).toBe(2);
		expect(gv.monsters[0].y).toBe(2);
		
		// inside perception range
		gv.onKeyPress(Direction.Right);
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(0);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].x).toBe(2);
		expect(gv.monsters[0].y).toBe(1);
	});
});

describe('healing', () => {
	test('happens', () => {
		const gv = new Galgenvogel(() => NO_WALLS, 0);

		gv.init();
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.player.magic).toBe(MAGIC_START);
		
		for(var i=0; i<HEAL_DELAY-1; i++) {
			gv.onKeyPress(Direction.Up);
			expect(gv.player.health).toBe(HEALTH_START);
			expect(gv.player.magic).toBe(MAGIC_START);			
		}

		gv.onKeyPress(Direction.Up)
		expect(gv.player.health).toBe(HEALTH_START+1);
		expect(gv.player.magic).toBe(MAGIC_START+1);
	});

	test('is limited', () => {
		const gv = new Galgenvogel(() => NO_WALLS, 0);
		gv.init();

		for(var i=0; i<HEAL_DELAY*2; i++) {
			gv.onKeyPress(Direction.Up);
		}
		expect(gv.player.health).toBe(HEALTH_MAX);
		expect(gv.player.magic).toBe(MAGIC_MAX);			

		for(var i=0; i<HEAL_DELAY; i++) {
			gv.onKeyPress(Direction.Up);
		}
		expect(gv.player.health).toBe(HEALTH_MAX);
		expect(gv.player.magic).toBe(MAGIC_MAX);			
	});
});

describe('melee', () => {
	test('exchange blows', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords
			 .mockReturnValueOnce( [1,1] )
			 .mockReturnValueOnce( [2,1] );
		const gv = new Galgenvogel(() => NO_WALLS, 1);
		gv.generateMonster = () => new Monster(Color.Orange, 2, 1, 10);

		gv.init(null);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].x).toBe(2);
		expect(gv.monsters[0].y).toBe(1);
		expect(gv.monsters[0].health).toBe(2);
		
		gv.onKeyPress(Direction.Right);
		expect(window.alert).not.toHaveBeenCalled();
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		expect(gv.player.health).toBe(HEALTH_START-1);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(1);
	});
	
	test('kill monsters and win', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords
			 .mockReturnValueOnce( [1,1] )
			 .mockReturnValueOnce( [0,1] )
			 .mockReturnValueOnce( [2,1] );
		const gv = new Galgenvogel(() => NO_WALLS, 2);
		gv.generateMonster = () => new Monster(Color.Orange, 1, 1, 10);

		gv.init();
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.monsters.length).toBe(2);
		expect(gv.monsters[0].health).toBe(1);
		expect(gv.monsters[1].health).toBe(1);
		
		gv.init = jest.fn();
		gv.player.init = jest.fn();
		gv.onKeyPress(Direction.Right);
		expect(gv.player.health).toBe(HEALTH_START-1);
		expect(gv.monsters.length).toBe(1);
		expect(window.alert).not.toHaveBeenCalled();
		expect(gv.init).not.toHaveBeenCalled();
		expect(gv.player.init).not.toHaveBeenCalled();
		
		gv.onKeyPress(Direction.Left);
		expect(gv.player.health).toBe(HEALTH_START-1);
		expect(gv.monsters.length).toBe(0);
		expect(window.alert).toHaveBeenCalledWith("You win! Let's make it more difficult.");
		expect(gv.init).toHaveBeenCalled();
		expect(gv.player.init).not.toHaveBeenCalled();
	});

	test('more monsters in next level', () => {
		const numMonsters = 1;
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords
			 .mockReturnValueOnce( [1,1] )
			 .mockReturnValueOnce( [2,1] )
			 .mockReturnValueOnce( [1,1] )
			 .mockReturnValueOnce( [2,1] )
			 .mockReturnValueOnce( [0,1] );
		const gv = new Galgenvogel(() => NO_WALLS, numMonsters);
		gv.generateMonster = () => new Monster(Color.Orange, 1, 1, 10);

		gv.init();
		expect(gv.monsters.length).toBe(numMonsters);
		
		gv.onKeyPress(Direction.Right);
		expect(window.alert).toHaveBeenCalledWith("You win! Let's make it more difficult.");
		expect(gv.monsters.length).toBe(numMonsters+MONSTER_INCREASE)
	});

	test('get killed and lose', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords
			 .mockReturnValueOnce( [1,1] )
			 .mockReturnValueOnce( [2,1] );
		const gv = new Galgenvogel(() => NO_WALLS, 1);
		gv.generateMonster = () => new Monster(Color.Orange, 5, 3, 10);

		gv.init();
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(5);
		
		gv.init = jest.fn();
		gv.player.init = jest.fn();
		gv.onKeyPress(Direction.Right);
		expect(gv.player.health).toBe(0);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(4);
		expect(window.alert).toHaveBeenCalledWith("You lose! Let's start over.");
		expect(gv.init).toHaveBeenCalled();
		expect(gv.player.init).toHaveBeenCalled();
	});
});

describe('magic', () => {
	test('does not work on walls', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords
			 .mockReturnValueOnce( [0,0] );
		const gv = new Galgenvogel(() => [[0,0],[0,1]], 0);

		gv.init();
		expect(gv.player.magic).toBe(1);		

		gv.onDotClicked(1, 1+HEIGHT_OFFSET);
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.player.magic).toBe(1);		
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		expect(window.alert).not.toHaveBeenCalled();
		
	});
	
	test('kill monster with magic and win', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords
			 .mockReturnValueOnce( [1,1] )
			 .mockReturnValueOnce( [2,1] );
		const gv = new Galgenvogel(() => NO_WALLS, 1);
		gv.generateMonster = () => new Monster(Color.Orange, 4, 1, 10);

		gv.init();
		gv.player.magic = 2;
		gv.init = jest.fn();
		gv.player.init = jest.fn();

		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(4);
		
		gv.onDotClicked(2, 1+HEIGHT_OFFSET);
		expect(gv.player.health).toBe(HEALTH_START-1);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(2);
		expect(gv.player.magic).toBe(1);		
		expect(window.alert).not.toHaveBeenCalled();
		expect(gv.init).not.toHaveBeenCalled();
		expect(gv.player.init).not.toHaveBeenCalled();			
		
		gv.onDotClicked(2, 1+HEIGHT_OFFSET);
		expect(gv.player.health).toBe(HEALTH_START-1);
		expect(gv.player.magic).toBe(0);
		expect(gv.monsters.length).toBe(0);
		expect(window.alert).toHaveBeenCalledWith("You win! Let's make it more difficult.");
		expect(gv.init).toHaveBeenCalled();
		expect(gv.player.init).not.toHaveBeenCalled();
	});

	test('teleport', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords
			 .mockReturnValueOnce( [1,1] )
			 .mockReturnValueOnce( [2,1] );
		const gv = new Galgenvogel(() => NO_WALLS, 0);

		gv.init();
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		expect(gv.player.magic).toBe(1);
		
		gv.onDotClicked(1, 1+HEIGHT_OFFSET);
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(1);
		expect(gv.player.magic).toBe(0);
	});

	test('magic is limited', () => {
		const randomCoords = jest.spyOn(RANDOM, "coords");
		randomCoords
			 .mockReturnValueOnce( [1,1] )
			 .mockReturnValueOnce( [2,1] )
			 .mockReturnValueOnce( [2,2] );
		const gv = new Galgenvogel(() => NO_WALLS, 1);
		gv.generateMonster = () => new Monster(Color.Orange, 1, 1, 10);


		gv.init();
		gv.init = jest.fn();
		gv.player.init = jest.fn();
		gv.player.magic = 0;

		const checkEverythingUnchanged = () => {
			expect(gv.player.x).toBe(1);
			expect(gv.player.y).toBe(1);
			expect(gv.player.health).toBe(HEALTH_START);
			expect(gv.monsters.length).toBe(1);
			expect(gv.monsters[0].health).toBe(1);
			expect(window.alert).not.toHaveBeenCalled();
			expect(gv.init).not.toHaveBeenCalled();
			expect(gv.player.init).not.toHaveBeenCalled();			
		};
		checkEverythingUnchanged();
		
		gv.onDotClicked(2, 1+HEIGHT_OFFSET);
		checkEverythingUnchanged(); // no damage

		gv.onDotClicked(1, 1+HEIGHT_OFFSET);
		checkEverythingUnchanged(); // no teleport
	});
});