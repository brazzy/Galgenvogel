import { jest } from '@jest/globals';
import { Color, Direction } from '../src/engine-types.js';
import { Player } from '../src/player.js';


describe('player', () => {
	const TEST_CYCLE = 3;
	const TEST_WIDTH = 10;
	
	test('blinks', () => {
		const player = new Player(TEST_CYCLE);
		expect(player.color).toBe(Color.Green);
		expect(player.color).toBe(Color.Green);
		expect(player.color).toBe(Color.Green);
		expect(player.color).toBe(Color.Gray);
		expect(player.color).toBe(Color.Green);
	});

	test('stats', () => {
		const player = new Player(TEST_CYCLE);
		const mock = jest.fn();
		const game = {setDot: mock};

		player.paintStatus(game, TEST_WIDTH);

		for(var i=0; i<TEST_WIDTH; i++) {
			expect(mock).toHaveBeenCalledWith(i, 1, Color.Black);
		}

		expect(mock).toHaveBeenCalledWith(0, 0, Color.Red);
		expect(mock).toHaveBeenCalledWith(1, 0, Color.Red);
		expect(mock).toHaveBeenCalledWith(2, 0, Color.Red);
		expect(mock).toHaveBeenCalledWith(3, 0, Color.Gray);
		expect(mock).toHaveBeenCalledWith(4, 0, Color.Gray);
		expect(mock).toHaveBeenCalledWith(5, 0, Color.Black);
		expect(mock).toHaveBeenCalledWith(6, 0, Color.Black);
		expect(mock).toHaveBeenCalledWith(7, 0, Color.Black);
		expect(mock).toHaveBeenCalledWith(8, 0, Color.Gray);
		expect(mock).toHaveBeenCalledWith(9, 0, Color.Blue);
		
		
	});
});