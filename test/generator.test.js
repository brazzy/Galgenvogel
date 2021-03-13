import { jest } from '@jest/globals';
import { Room, Wallgrid, generateRoom, generateLevel } from '../src/generator.js';
import { transpose, invert } from '../src/level.js';
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

function invertDirection(dir) {
    switch(dir) {
        case Direction.Left:
            return Direction.Right;
        case Direction.Up:
            return Direction.Down;
        case Direction.Right:
            return Direction.Left;
        case Direction.Down:
            return Direction.Up;
    }
}

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

		.mockReturnValueOnce( 1 )
		.mockReturnValueOnce( 4 )
		.mockReturnValueOnce( 2 )
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

describe('Wallgrid', () => {
    const paramValidateCorridorStart = [
        [0,0,false],
        [1,0,false],
        [4,4,true],
        [4,1,true],
    ];

    test.each(paramValidateCorridorStart)(
        "position %d,%d valid: %s",
        (x,y,expected) => {
            const grid = Wallgrid.transposed(
            [[1,1,1,1,1,1],
             [1,0,0,1,1,1],
             [1,0,0,1,1,1],
             [1,1,1,1,1,1],
             [1,1,1,1,1,1],
             [1,1,1,1,1,1],
            ]);
            expect(grid.validateCorridorStart(x,y)).toBe(expected);
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
            const grid = Wallgrid.transposed(
            [[1,1,1,1,1,0],
             [1,1,1,1,1,1],
             [1,1,1,1,1,1],
             [1,1,1,1,1,1],
             [1,1,1,0,1,1],
             [1,1,1,1,1,1],
            ]);
            expect(grid.blockedMove(x,y, ...directions)).toBe(expected);
        }
    );

    test('blockedMove invalid direction', () => {
            expect(() => new Wallgrid(EMPTY_LEVEL).blockedMove(1,1, Direction.Left, 'UNKNOWN')).toThrow("Unknown direction: UNKNOWN");
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
            const grid = Wallgrid.transposed(
            [[1,1,1,1,1,0],
             [1,1,1,1,1,1],
             [1,1,1,1,1,1],
             [0,1,1,1,1,1],
             [1,1,1,1,1,1],
             [1,1,1,1,1,1],
            ]);
            expect(grid.blockedDirection(x,y, direction)).toBe(expected);
        }
    );

    test('blockedDirection invalid direction', () => {
            expect(() => new Wallgrid(EMPTY_LEVEL).blockedDirection(1,1, 'UNKNOWN')).toThrow("Unknown direction: UNKNOWN");
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
        [0,2, Direction.Left, false],
        [0,2, Direction.Right, true],
        [0,2, Direction.Right, true],
        [5,2, Direction.Up, false],
        [5,2, Direction.Down, false],
        [5,2, Direction.Left, false],
        [5,2, Direction.Right, true],
        [5,1, Direction.Up, false],
        [5,1, Direction.Down, false],
        [5,1, Direction.Left, true],
        [5,1, Direction.Right, true],
        [1,5, Direction.Left, false],
        [1,5, Direction.Right, false],
        [1,5, Direction.Up, true],
        [1,5, Direction.Down, true],
        [0,1, Direction.Up, false],
        [0,1, Direction.Down, false],
        [0,1, Direction.Left, true],
        [0,1, Direction.Right, true],
    ];

    test.each(paramValidCorridorDirection)(
        "position %d,%d valid direction %s: %s",
        (x,y,direction,expected) => {
            const grid = Wallgrid.transposed(
            [[1,1,1,1,1,1],
             [1,1,1,1,1,1],
             [1,1,1,1,1,1],
             [1,1,1,0,0,0],
             [1,1,1,0,0,1],
             [1,1,1,1,1,1],
            ]);
            expect(grid.validCorridorDirection(x,y,direction)).toBe(expected);
            grid.invert();
            expect(grid.validCorridorDirection(5-x, 5-y, invertDirection(direction))).toBe(expected);
        }
    );


    const paramValidCorridorDirections = [
        // all directions OK
        [1,1, [Direction.Up, Direction.Right, Direction.Down, Direction.Left]],
        // including wraparound, but not along edge of level
        [1,0, [Direction.Up, Direction.Down]],
        // and not when we end up bordering a room
        [1,4, [Direction.Up, Direction.Down]],
        // not even diagonally
        [2,1, [Direction.Right, Direction.Left]],
        // also not wraparound where the connecting square on the other side borders a room
        [4,1, [Direction.Right, Direction.Left]],
        // can't go back either
        [3,3, [Direction.Up, Direction.Left]],
    ];

    test.each(paramValidCorridorDirections)(
        "position %d,%d valid directions: %o",
        (x,y,expected) => {
            const grid = Wallgrid.transposed(
            [[1,1,1,1,1,1],
             [1,1,1,1,1,1],
             [1,1,1,1,1,1],
             [1,1,1,0,1,1],
             [1,1,1,0,0,1],
             [1,1,1,1,1,1],
            ]);
            expect(grid.validCorridorDirections(x,y)).toMatchObject(expected);
        }
    );

    test('addCorridor1', () => {
        const grid = Wallgrid.transposed(
            [[1,1,1,1,1,1,1,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,0,0,1,1],
             [1,1,1,1,1,1,0,0,1,1],
             [1,1,1,1,1,1,0,0,1,1],
             [1,1,1,1,1,1,0,0,1,1],
             [1,1,1,1,1,1,1,1,1,1],
        ]);

        const expected = Wallgrid.transposed(
            [[1,1,1,1,1,1,1,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,1,1,1,1,1,1,1],
             [0,0,0,0,0,1,0,0,1,0],
             [1,1,1,1,0,1,0,0,1,1],
             [1,1,1,1,0,1,0,0,1,1],
             [1,1,1,1,0,1,0,0,1,1],
             [1,1,1,1,1,1,1,1,1,1],
        ]);
        grid.addCorridor(4, 7);
        expect(grid.print()).toMatch(expected.print());
    });

    test('addCorridor2', () => {
        const grid = Wallgrid.transposed(
            [[1,1,1,1,1,1,1,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,1,1,1,1],
        ]);

        const expected = Wallgrid.transposed(
            [[1,0,1,1,1,1,1,1,1,1],
             [1,0,1,0,0,0,0,1,1,1],
             [1,0,1,0,0,0,0,1,1,1],
             [1,0,1,1,1,1,1,1,1,1],
             [1,0,0,0,0,1,0,0,0,1],
             [1,1,1,1,0,1,0,0,0,1],
             [1,0,0,1,0,1,0,0,0,1],
             [1,0,1,1,0,1,0,0,0,1],
             [1,0,1,1,1,1,1,1,1,1],
        ]);
        grid.addCorridor(4, 7);
        expect(grid.print()).toMatch(expected.print());
    });

    test('addCorridor3', () => {
        const grid = Wallgrid.transposed(
            [[1,1,1,1,1,1,1,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,1,1,1,1],
        ]);

        const expected = Wallgrid.transposed(
            [[1,0,1,1,1,1,1,1,1,1],
             [1,0,1,0,0,0,0,1,0,1],
             [1,0,1,0,0,0,0,1,0,1],
             [1,1,1,1,1,1,1,1,1,1],
             [1,0,0,0,0,1,0,0,0,1],
             [1,0,1,1,0,1,0,0,0,1],
             [1,0,1,1,0,1,0,0,0,1],
             [1,0,1,0,0,1,0,0,0,1],
             [1,0,1,1,1,1,1,1,1,1],
        ]);
        grid.addCorridor(1, 2);
        grid.addCorridor(8, 2);
        expect(grid.print()).toMatch(expected.print());
    });

    test('addCorridor4', () => {
        const grid = Wallgrid.transposed(
            [[1,1,1,1,1,1,1,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,0,0,0,0,1,1,1],
             [1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,0,0,0,1],
             [1,1,1,1,1,1,1,1,1,1],
        ]);

        const expected = Wallgrid.transposed(
            [[1,0,1,1,1,1,1,1,1,1],
             [0,0,1,0,0,0,0,1,0,0],
             [1,1,1,0,0,0,0,1,0,1],
             [1,0,1,1,1,1,1,1,1,1],
             [1,0,1,1,0,1,0,0,0,1],
             [1,0,1,1,0,1,0,0,0,1],
             [1,0,1,1,0,1,0,0,0,1],
             [1,0,1,0,0,1,0,0,0,1],
             [1,0,1,1,1,1,1,1,1,1],
        ]);
        grid.addCorridor(8, 2);
        grid.addCorridor(4, 4);
        expect(grid.print()).toMatch(expected.print());
    });
});


