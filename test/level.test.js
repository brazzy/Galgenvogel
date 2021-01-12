import { jest } from '@jest/globals';
import { Level, transpose } from '../src/level.js';

// see https://stackoverflow.com/a/60669731/16883 - but fails with 
// "randomCoords.mockImplementation is not a function"
//import { randomCoords } from '../src/random.js';
//jest.mock('../src/random.js', () => ({
//  __esModule: true,
//  randomCoords: jest.fn(),
//}));
//randomCoords.mockImplementation( () => [DEFAULT_X, DEFAULT_Y] );

// see https://stackoverflow.com/a/40486695/16883 - but fails with 
// "Cannot assign to read only property 'randomCoords' of object '[object Module]'"
// import * as random from '../src/random.js';
// random.randomCoords = jest.fn();
// random.randomCoords.mockImplementation( () => [DEFAULT_X, DEFAULT_Y] );

const DEFAULT_X = 1;
const DEFAULT_Y = 2;


describe('transpose', () => {
	test('works', () => {
		const result = transpose([[1,0,1],
		                          [0,0,0],
								  [0,1,0]]);
		expect(result).toMatchObject([[1,0,0],
									  [0,0,1],
									  [1,0,0]]);
	});
	test('rectangular', () => {
		const result = transpose([[1,0,1],
								  [0,1,0]]);
		expect(result).toMatchObject([[1,0],
									  [0,1],
									  [1,0]]);
	});
	test('size 1', () => {
		const result = transpose([[1]]);
		expect(result).toMatchObject([[1]]);
	});
	test('size 0', () => {
		const result = transpose([]);
		expect(result).toMatchObject([]);
	});
});

describe('pathfinding algorithm', () => {
	
	test('computes basic distances', () => {
		const level = new Level([[0,0,0],
								 [0,0,0],
								 [0,0,0]]);
		level.setTarget({x: 1, y: 1});
		expect(level.targetDistances).toMatchObject([[2,1,2],
													 [1,0,1],
													 [2,1,2]]);
	});

	test('recognizes walls', () => {
		const level = new Level([[1,0,1],
								 [0,0,0],
								 [1,0,1]]);
		level.setTarget({x: 1, y: 1});
		expect(level.targetDistances).toMatchObject([[NaN,1,NaN],
													 [1,  0,1],
													 [NaN,1,NaN]]);
	});

	test('wraps around up', () => {
		const level = new Level(transpose([[1,0,1],
										   [0,0,0],
										   [1,0,1]]));
		level.setTarget({x: 1, y: 0});
		expect(level.targetDistances).toMatchObject(transpose([[NaN,0,NaN],
															   [2,  1,2],
															   [NaN,1,NaN]]));
	});

	test('wraps around left', () => {
		const level = new Level(transpose([[1,0,1],
										   [0,0,0],
										   [1,0,1]]));
		level.setTarget({x: 0, y: 1});
		expect(level.targetDistances).toMatchObject(transpose([[NaN,2,NaN],
															   [0,  1,1],
															   [NaN,2,NaN]]));
	});

	test('wraps around down', () => {
		const level = new Level(transpose([[1,0,1],
										   [0,0,0],
										   [1,0,1]]));
		level.setTarget({x: 1, y: 2});
		expect(level.targetDistances).toMatchObject(transpose([[NaN,1,NaN],
															   [2,  1,2],
															   [NaN,0,NaN]]));
	});

	test('wraps around right', () => {
		const level = new Level(transpose([[1,0,1],
										   [0,0,0],
										   [1,0,1]]));
		level.setTarget({x: 2, y: 1});
		expect(level.targetDistances).toMatchObject(transpose([[NaN,2,NaN],
															   [1  ,1,0],
															   [NaN,2,NaN]]));
	});
});

describe('placeRandomly', () => {
	test('works', () => {
		// workaround
		const randomCoords = jest.fn();
		randomCoords.mockImplementation( () => [DEFAULT_X, DEFAULT_Y] );
		const level = new Level([[0,0,0],[0,0,0],[0,0,0]], randomCoords);
		const being = { x: null, y: null }


		level.placeRandomly(being);
		expect(randomCoords).toHaveBeenCalledTimes(1);
		expect(being.x).toBe(DEFAULT_X);
		expect(being.y).toBe(DEFAULT_Y);
		expect(level.grid[DEFAULT_X][DEFAULT_Y]).toBe(being);
	});
});

describe('constructor', () => {
	test('rejects irregular levels', () => {
		const create = () => {
			new Level([[0,0,0],[0,0],[0,0,0]]);
		}
		expect(create).toThrow("irregular level shape in column 1");
	});

	test('rejects unknown values', () => {
		const create = () => {
			new Level([[0,2,0],[0,0],[0,0,0]]);
		}
		expect(create).toThrow("illegal value 2 at 0,1");
	});
});