import { Galgenvogel, HEIGHT_OFFSET, NUM_MONSTERS } from '../src/Galgenvogel.js';
import { Color, Direction } from '../src/engine-types.js';
import { Monster } from '../src/monster.js';
import { HEAL_DELAY, HEALTH_START, HEALTH_MAX, MAGIC_START, MAGIC_MAX } from '../src/player.js';
import { jest } from '@jest/globals';

const NO_WALLS = [[0,0,0], [0,0,0], [0,0,0]];

describe('smoketest', () => {	
	test('default initialization', () => {
		const gv = new Galgenvogel();
		gv.init();
		expect(gv.monsters.length).toBe(NUM_MONSTERS);
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.player.magic).toBe(MAGIC_START);
		expect(gv.level.width).toBe(24);
		expect(gv.level.height).toBe(24-HEIGHT_OFFSET);
		expect(gv.level.targetDistances.length).toBe(24-HEIGHT_OFFSET);
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
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [1,1] );
		const gv = new Galgenvogel(() => NO_WALLS, 0, randomCoords);

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
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [1,1] );
		const gv = new Galgenvogel(() => [[1,1,1], [1,0,1], [1,1,1]], 0, randomCoords);

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
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [0,0] );
		const gv = new Galgenvogel(() => NO_WALLS, 0, randomCoords);

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
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [0,0] );
		const gv = new Galgenvogel(() => [[0,0,1], [0,0,0], [1,0,0]], 0, randomCoords);

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
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [2,2] );
		const gv = new Galgenvogel(() => [[0,0,1], [0,0,0], [1,0,0]], 0, randomCoords);

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

	test('monster follows', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [0,0] )
			.mockImplementationOnce( () => [1,0] );
		const finish = jest.fn();
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords, finish);

		gv.init();
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].x).toBe(1);
		expect(gv.monsters[0].y).toBe(0);
		
		gv.onKeyPress(Direction.Down);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(1);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].x).toBe(1);
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
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		jest.spyOn(window, 'alert').mockImplementation(() => {});
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords);
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
	
	test('kill monster and win', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		jest.spyOn(window, 'alert').mockImplementation(() => {});
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords);
		gv.generateMonster = () => new Monster(Color.Orange, 1, 1, 10);

		gv.init();
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(1);
		
		gv.init = jest.fn();
		gv.player.init = jest.fn();
		gv.onKeyPress(Direction.Right);
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.monsters.length).toBe(0);
		expect(window.alert).toHaveBeenCalledWith("you win!");
		expect(gv.init).toHaveBeenCalled();
		expect(gv.player.init).not.toHaveBeenCalled();
	});

	test('get killed and lose', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		jest.spyOn(window, 'alert').mockImplementation(() => {});
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords);
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
		expect(window.alert).toHaveBeenCalledWith("you lose!");
		expect(gv.init).toHaveBeenCalled();
		expect(gv.player.init).toHaveBeenCalled();
	});
});

describe('magic', () => {
	test('kill monster with magic and win', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		jest.spyOn(window, 'alert').mockImplementation(() => {});
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords);
		gv.generateMonster = () => new Monster(Color.Orange, 1, 1, 10);

		gv.init();
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.player.magic).toBe(1);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(1);
		
		gv.init = jest.fn();
		gv.player.init = jest.fn();
		gv.onDotClicked(2, 1+HEIGHT_OFFSET);
		expect(gv.player.health).toBe(HEALTH_START);
		expect(gv.monsters.length).toBe(0);
		expect(window.alert).toHaveBeenCalledWith("you win!");
		expect(gv.init).toHaveBeenCalled();
		expect(gv.player.init).not.toHaveBeenCalled();
	});

	test('teleport', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		const gv = new Galgenvogel(() => NO_WALLS, 0, randomCoords);

		gv.init();
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		
		gv.onDotClicked(1, 1+HEIGHT_OFFSET);
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(1);
	});

});