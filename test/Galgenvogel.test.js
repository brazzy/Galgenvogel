import { Galgenvogel, HEIGHT_OFFSET } from '../src/Galgenvogel.js';
import { Color, Direction } from '../src/engine-types.js';
import { Monster } from '../src/monster.js';
import { jest } from '@jest/globals';

const NO_WALLS = [[0,0,0], [0,0,0], [0,0,0]];

describe('movement', () => {
	
	test('basic', () => {
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [1,1] );
		const gv = new Galgenvogel(() => NO_WALLS, 0, randomCoords);

		gv.init(null);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		
		gv.onKeyPress(Direction.Up)
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(0);
		
		gv.onKeyPress(Direction.Down)
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);

		gv.onKeyPress(Direction.Left)
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(1);

		gv.onKeyPress(Direction.Right)
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
	});

	test('walls', () => {
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [1,1] );
		const gv = new Galgenvogel(() => [[1,1,1], [1,0,1], [1,1,1]], 0, randomCoords);

		gv.init(null);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		
		gv.onKeyPress(Direction.Up)
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		
		gv.onKeyPress(Direction.Down)
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);

		gv.onKeyPress(Direction.Left)
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);

		gv.onKeyPress(Direction.Right)
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
	});

	test('wraparound', () => {
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [0,0] );
		const gv = new Galgenvogel(() => NO_WALLS, 0, randomCoords);

		gv.init(null);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		
		gv.onKeyPress(Direction.Up)
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(2);
		
		gv.onKeyPress(Direction.Down)
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);

		gv.onKeyPress(Direction.Left)
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(0);

		gv.onKeyPress(Direction.Right)
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
	});

	test('wraparound blocked by walls up and left', () => {
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [0,0] );
		const gv = new Galgenvogel(() => [[0,0,1], [0,0,0], [1,0,0]], 0, randomCoords);

		gv.init(null);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		
		gv.onKeyPress(Direction.Up)
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		
		gv.onKeyPress(Direction.Left)
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
	});

	test('wraparound blocked by walls down and right', () => {
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [2,2] );
		const gv = new Galgenvogel(() => [[0,0,1], [0,0,0], [1,0,0]], 0, randomCoords);

		gv.init(null);
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(2);
		
		gv.onKeyPress(Direction.Down)
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(2);
		
		gv.onKeyPress(Direction.Right)
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(2);
	});

	test('monster follows', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [0,0] )
			.mockImplementationOnce( () => [1,0] );
		const finish = jest.fn();
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords, finish, () => new Monster(Color.Orange, 2, 1, 10));

		gv.init(null);
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(0);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].x).toBe(1);
		expect(gv.monsters[0].y).toBe(0);
		
		gv.onKeyPress(Direction.Down)
		expect(gv.player.x).toBe(0);
		expect(gv.player.y).toBe(1);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].x).toBe(1);
		expect(gv.monsters[0].y).toBe(1);
	});

	test('exchange blows', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		const finish = jest.fn();
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords, finish, () => new Monster(Color.Orange, 2, 1, 10));

		gv.init(null);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		expect(gv.player.health).toBe(3);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].x).toBe(2);
		expect(gv.monsters[0].y).toBe(1);
		expect(gv.monsters[0].health).toBe(2);
		
		gv.onKeyPress(Direction.Right)
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		expect(gv.player.health).toBe(2);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(1);
		expect(finish).not.toHaveBeenCalled();
	});
	
	test('kill monster and win', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		const finish = jest.fn();
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords, finish, () => new Monster(Color.Orange, 1, 1, 10));

		gv.init(null);
		expect(gv.player.health).toBe(3);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(1);
		
		gv.onKeyPress(Direction.Right)
		expect(gv.player.health).toBe(3);
		expect(gv.monsters.length).toBe(0);
		expect(finish).toHaveBeenCalledWith(true);
	});

	test('get killed and lose', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		const finish = jest.fn();
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords, finish, () => new Monster(Color.Orange, 5, 3, 10));

		gv.init(null);
		expect(gv.player.health).toBe(3);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(5);
		
		gv.onKeyPress(Direction.Right)
		expect(gv.player.health).toBe(0);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(4);
		expect(finish).toHaveBeenCalledWith(false);
	});

	test('kill monster with magic and win', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		const finish = jest.fn();
		const gv = new Galgenvogel(() => NO_WALLS, 1, randomCoords, finish, () => new Monster(Color.Orange, 1, 1, 10));

		gv.init(null);
		expect(gv.player.health).toBe(3);
		expect(gv.player.magic).toBe(1);
		expect(gv.monsters.length).toBe(1);
		expect(gv.monsters[0].health).toBe(1);
		
		gv.onDotClicked(2, 1+HEIGHT_OFFSET)
		expect(gv.player.health).toBe(3);
		expect(gv.monsters.length).toBe(0);
		expect(finish).toHaveBeenCalledWith(true);
	});

	test('teleport', () => {
		const randomCoords = jest.fn();
		randomCoords
			.mockImplementationOnce( () => [1,1] )
			.mockImplementationOnce( () => [2,1] );
		const finish = jest.fn();
		const gv = new Galgenvogel(() => NO_WALLS, 0, randomCoords);

		gv.init(null);
		expect(gv.player.x).toBe(1);
		expect(gv.player.y).toBe(1);
		
		gv.onDotClicked(1, 1+HEIGHT_OFFSET)
		expect(gv.player.x).toBe(2);
		expect(gv.player.y).toBe(1);
	});

});