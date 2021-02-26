import { jest } from '@jest/globals';
import { Room, generateRoom, generateLevel, validateCorridorStart, validCorridorDirection, validCorridorDirections, blockedDirection, blockedMove } from '../src/generator.js';
import { transpose } from '../src/level.js';
import { Direction } from '../src/engine-types.js';


const EMPTY_LEVEL = [
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
];

const ONE_ROOM = transpose([
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,0,0,1,1,1],
[1,1,1,1,1,0,0,1,1,1],
[1,1,1,1,1,0,0,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1],
]);

describe('Room', () => {

	const paramsToString = [
		[new Room(0,0,1,1), "(0,0 1x1)"],
		[new Room(7,10,5,2), "(7,10 5x2)"],
	];

	test.each(paramsToString)(
		"rooms %o is described as %s",
		(room, expected) => {
			expect(room.toString()).toBe(expected);
		}
	);

	const paramsFitsInto = [
		[new Room(0,0,1,1), true, EMPTY_LEVEL],
		[new Room(9,9,1,1), true, EMPTY_LEVEL],
		[new Room(0,9,1,1), true, EMPTY_LEVEL],
		[new Room(9,0,1,1), true, EMPTY_LEVEL],
		[new Room(0,0,10,10), true, EMPTY_LEVEL],
		[new Room(4,4,5,5), true, EMPTY_LEVEL],
		[new Room(0,0,11,11), false, EMPTY_LEVEL],
		[new Room(-1,0,1,1), false, EMPTY_LEVEL],
		[new Room(0,-1,1,1), false, EMPTY_LEVEL],
		[new Room(9,9,2,1), false, EMPTY_LEVEL],
		[new Room(9,9,1,2), false, EMPTY_LEVEL],

		[new Room(0,0,1,1), true, ONE_ROOM],
		[new Room(0,0,10,10), false, ONE_ROOM],
		[new Room(0,4,10,1), false, ONE_ROOM],

		[new Room(3,1,2,2), true, ONE_ROOM],
		[new Room(3,1,3,3), false, ONE_ROOM],
		[new Room(3,1,2,3), true, ONE_ROOM],
		[new Room(3,1,3,2), true, ONE_ROOM],

		[new Room(7,1,2,2), true, ONE_ROOM],
		[new Room(6,1,3,3), false, ONE_ROOM],
		[new Room(6,1,3,2), true, ONE_ROOM],
		[new Room(7,1,2,3), true, ONE_ROOM],

        [new Room(0,0,6,4), false, ONE_ROOM],
        [new Room(3,5,3,3), false, ONE_ROOM],
	];

	test.each(paramsFitsInto)(
		"room %s fits: %s",
		(room, expected, grid) => {
			expect(room.fitsInto(grid)).toBe(expected);
		}
	);

	const paramsFitsWithMargin = [
		[new Room(0,0,1,1), false, EMPTY_LEVEL],
		[new Room(9,9,1,1), false, EMPTY_LEVEL],
		[new Room(0,9,1,1), false, EMPTY_LEVEL],
		[new Room(9,0,1,1), false, EMPTY_LEVEL],
		[new Room(1,1,1,1), true, EMPTY_LEVEL],
		[new Room(8,1,1,1), true, EMPTY_LEVEL],
		[new Room(1,8,1,1), true, EMPTY_LEVEL],
		[new Room(8,8,1,1), true, EMPTY_LEVEL],
		[new Room(1,1,8,8), true, EMPTY_LEVEL],

		[new Room(1,1,3,8), true, ONE_ROOM],
		[new Room(1,1,8,1), true, ONE_ROOM],
		[new Room(1,7,8,2), true, ONE_ROOM],
		[new Room(8,1,1,8), true, ONE_ROOM],

		[new Room(1,1,4,2), false, ONE_ROOM],
		[new Room(4,6,1,1), false, ONE_ROOM],
		[new Room(7,6,1,1), false, ONE_ROOM],
		[new Room(7,2,1,1), false, ONE_ROOM],
    ];

	test.each(paramsFitsWithMargin)(
		"room %s fits with margin: %s",
		(room, expected, grid) => {
			expect(room.fitsWithMargin(grid)).toBe(expected);
		}
	);

	test('writeToLevel', () => {
		const room = new Room(2,1,2,3);
        const level = transpose(EMPTY_LEVEL);
        room.writeToLevel(level);
		expect(level).toMatchObject(transpose(
		                            [[1,1,1,1,1,1,1,1,1,1],
                                     [1,1,0,0,1,1,1,1,1,1],
                                     [1,1,0,0,1,1,1,1,1,1],
                                     [1,1,0,0,1,1,1,1,1,1],
                                     [1,1,1,1,1,1,1,1,1,1],
                                     [1,1,1,1,1,1,1,1,1,1],
                                     [1,1,1,1,1,1,1,1,1,1],
                                     [1,1,1,1,1,1,1,1,1,1],
                                     [1,1,1,1,1,1,1,1,1,1],
                                     [1,1,1,1,1,1,1,1,1,1],
                                     ]));
	});

});

test('generateRoom', () => {
	const randomInt = jest.fn();
	randomInt
		.mockReturnValueOnce( 3 )
		.mockReturnValueOnce( 1 )
		.mockReturnValueOnce( 2 )
		.mockReturnValueOnce( 0 );

	expect(generateRoom(10, 10, randomInt).toString()).toBe('(3,1 4x2)');
});

test('generateLevel', () => {
	const randomInt = jest.fn();
	randomInt
		.mockReturnValueOnce( 3 )
		.mockReturnValueOnce( 1 )
		.mockReturnValueOnce( 2 )
		.mockReturnValueOnce( 0 )

		.mockReturnValueOnce( 1 )
		.mockReturnValueOnce( 2 )
		.mockReturnValueOnce( 4 )
		.mockReturnValueOnce( 1 )

		.mockReturnValueOnce( 6 )
		.mockReturnValueOnce( 4 )
		.mockReturnValueOnce( 0 )
		.mockReturnValueOnce( 2 )
		;
	const level = generateLevel(10, 9, 3, randomInt);

	expect(level).toMatchObject(transpose(
								[[1,1,1,1,1,1,1,1,1,1],
								 [1,1,1,0,0,0,0,1,1,1],
								 [1,1,1,0,0,0,0,1,1,1],
								 [1,1,1,1,1,1,1,1,1,1],
								 [1,1,1,1,1,1,0,0,1,1],
								 [1,1,1,1,1,1,0,0,1,1],
								 [1,1,1,1,1,1,0,0,1,1],
								 [1,1,1,1,1,1,0,0,1,1],
								 [1,1,1,1,1,1,1,1,1,1],
								 ]));
});

const paramValidateCorridorStart = [
	[0,0,false],
	[1,0,false],
	[4,4,true],
	[4,1,true],
];

test.each(paramValidateCorridorStart)(
	"position %d,%d valid: %s",
	(x,y,expected) => {
		const level = transpose(
		[[1,1,1,1,1,1],
		 [1,0,0,1,1,1],
		 [1,0,0,1,1,1],
		 [1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		]);
		expect(validateCorridorStart(level, x,y)).toBe(expected);
	}
);

const paramBlockedMove = [
	[1,1, false, [Direction.Up]],
	[1,1, false, [Direction.Down]],
	[1,1, false, [Direction.Left]],
	[1,1, false, [Direction.Right]],

	[3,5, true, [Direction.Up]],
	[3,3, true, [Direction.Down]],
	[4,4, true, [Direction.Left]],
	[2,4, true, [Direction.Right]],

	[5,5, true, [Direction.Down]],
	[0,0, true, [Direction.Left]],

	[4,0, false, [Direction.Right, Direction.Up]],
	[4,0, false, [Direction.Right, Direction.Down]],

	[4,1, true, [Direction.Right, Direction.Up]],
	[4,5, true, [Direction.Right, Direction.Down]],
	[4,1, true, [Direction.Up, Direction.Right]],
	[4,5, true, [Direction.Down, Direction.Right]],

	[5,0, true, [Direction.Right, Direction.Left]],
	[5,0, true, [Direction.Left, Direction.Right]],
	[5,0, true, [Direction.Up, Direction.Down]],
	[5,0, true, [Direction.Down, Direction.Up]],

	[2,4, false, [Direction.Right, Direction.Right]],
];

test.each(paramBlockedMove)(
	"position %d,%d blocked move %s for directions %s",
	(x,y,expected, directions) => {
		const level = transpose(
		[[1,1,1,1,1,0],
		 [1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		 [1,1,1,0,1,1],
		 [1,1,1,1,1,1],
		]);
		expect(blockedMove(level, x,y, ...directions)).toBe(expected);
	}
);

test('blockedMove invalid direction', () => {
		expect(() => blockedMove(EMPTY_LEVEL, 1,1, Direction.Left, 'UNKNOWN')).toThrow("Unknown direction: UNKNOWN");
});

const paramBlockedDirection = [
	[1,1, Direction.Up, false],
	[1,1, Direction.Down, false],
	[1,1, Direction.Right, false],
	[1,1, Direction.Left, false],
	[0,0, Direction.Up, false],
	[0,0, Direction.Down, false],
	[0,0, Direction.Right, false],
	[0,0, Direction.Left, true],

	[1,1, Direction.Left, false],
	[1,2, Direction.Left, true],
	[1,3, Direction.Left, true],
	[1,4, Direction.Left, true],
	[1,5, Direction.Left, false],

	[5,1, Direction.Right, false],
	[5,2, Direction.Right, true],
	[5,3, Direction.Right, true],
	[5,4, Direction.Right, true],
	[5,5, Direction.Right, false],

	[2,2, Direction.Down, false],
    [1,2, Direction.Down, true],
	[0,2, Direction.Down, true],
	[5,2, Direction.Down, true],
	[4,2, Direction.Down, false],

	[2,4, Direction.Up, false],
    [1,4, Direction.Up, true],
	[0,4, Direction.Up, true],
	[5,4, Direction.Up, true],
	[4,4, Direction.Up, false],
];

test.each(paramBlockedDirection)(
	"position %d,%d blocked direction %s: %s",
	(x,y,direction,expected) => {
		const level = transpose(
		[[1,1,1,1,1,0],
		 [1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		 [0,1,1,1,1,1],
		 [1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		]);
		expect(blockedDirection(level, x,y, direction)).toBe(expected);
	}
);

test('blockedDirection invalid direction', () => {
		expect(() => blockedDirection(EMPTY_LEVEL, 1,1, 'UNKNOWN')).toThrow("Unknown direction: UNKNOWN");
});

const paramValidCorridorDirection = [
	[1,1, Direction.Up, true],
	[1,1, Direction.Down, true],
	[1,1, Direction.Right, true],
	[1,1, Direction.Left, true],
	[1,0, Direction.Up, true],
	[1,0, Direction.Down, true],
	[1,0, Direction.Right, false],
	[1,0, Direction.Left, false],
	[1,4, Direction.Up, true],
	[1,4, Direction.Down, true],
	[1,4, Direction.Right, false],
	[1,4, Direction.Left, false],
	[1,2, Direction.Up, true],
	[1,2, Direction.Down, true],
	[1,2, Direction.Right, false],
	[1,2, Direction.Left, false],
	[2,1, Direction.Up, false],
	[2,1, Direction.Down, false],
	[2,1, Direction.Right, true],
	[2,1, Direction.Left, true],
	[4,1, Direction.Up, false],
	[4,1, Direction.Down, false],
	[4,1, Direction.Right, true],
	[4,1, Direction.Left, true],
	[0,2, Direction.Up, false],
	[0,2, Direction.Down, false],
	[5,2, Direction.Up, false],
	[5,2, Direction.Down, false],
];

test.each(paramValidCorridorDirection)(
	"position %d,%d valid direction %s: %s",
	(x,y,direction,expected) => {
		const level = transpose(
		[[1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		 [1,1,1,0,0,0],
		 [1,1,1,0,0,1],
		 [1,1,1,1,1,1],
		]);
		expect(validCorridorDirection(level, x,y,direction)).toBe(expected);
	}
);

const paramValidCorridorDirections = [
	[1,1, [[1,0],[2,1],[1,2],[0,1]]], // all directions OK
	[1,0, [[1,5],[1,1]]],			  // including wraparound, but not along edge of level
	[1,4, [[1,3],[1,5]]],			  // and not when we end up bordering a room
	[2,1, [[3,1],[1,1]]],			  // not even diagonally
	[4,1, [[5,1],[3,1]]],			  // also not wraparound where the connecting square on the other side borders a room
	[3,3, [[3,2],[2,3]]],			  // can't go back either
];

test.each(paramValidCorridorDirections)(
	"position %d,%d valid directions: %o",
	(x,y,expected) => {
		const level = transpose(
		[[1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		 [1,1,1,1,1,1],
		 [1,1,1,0,1,1],
		 [1,1,1,0,0,1],
		 [1,1,1,1,1,1],
		]);
		expect(validCorridorDirections(level, x,y)).toMatchObject(expected);
	}
);
