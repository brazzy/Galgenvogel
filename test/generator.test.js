import { jest } from '@jest/globals';
import { Room } from '../src/generator.js';
import { transpose } from '../src/level.js';


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
});
