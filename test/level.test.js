import { Level } from '../src/level.js';

describe('pathfinding algorithm', () => {
	
	test('computes basic distances', () => {
		const level = new Level([[0,0,0],[0,0,0],[0,0,0]], 0);
		level.setTarget({x: 1, y: 1});
		expect(level.targetDistances).toMatchObject ([[2,1,2],[1,0,1],[2,1,2]]);
	});

	test('recognizes walls', () => {
		const level = new Level([[1,0,1],[0,0,0],[1,0,1]], 0);
		level.setTarget({x: 1, y: 1});
		expect(level.targetDistances).toMatchObject ([[NaN,1,NaN],[1,0,1],[NaN,1,NaN]]);
	});

	test('wraps around up', () => {
		const level = new Level([[1,0,1],[0,0,0],[1,0,1]], 0);
		level.setTarget({x: 1, y: 0});
		expect(level.targetDistances).toMatchObject ([[NaN,0,NaN],[2,1,2],[NaN,1,NaN]]);
	});

	test('wraps around left', () => {
		const level = new Level([[1,0,1],[0,0,0],[1,0,1]], 0);
		level.setTarget({x: 0, y: 1});
		expect(level.targetDistances).toMatchObject ([[NaN,2,NaN],[0,1,1],[NaN,2,NaN]]);
	});

	test('wraps around down', () => {
		const level = new Level([[1,0,1],[0,0,0],[1,0,1]], 0);
		level.setTarget({x: 1, y: 2});
		expect(level.targetDistances).toMatchObject ([[NaN,1,NaN],[2,1,2],[NaN,0,NaN]]);
	});

	test('wraps around right', () => {
		const level = new Level([[1,0,1],[0,0,0],[1,0,1]], 0);
		level.setTarget({x: 2, y: 1});
		expect(level.targetDistances).toMatchObject ([[NaN,2,NaN],[1,1,0],[NaN,2,NaN]]);
	});
});