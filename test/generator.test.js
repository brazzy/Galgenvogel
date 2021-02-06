import { jest } from '@jest/globals';
import { generateLevel, findLargestPossibleRoom } from '../src/generator.js';
import { transpose } from '../src/level.js';

// NOTE: This is incomplete and unneccessarily complicated, will abandon this and try
// the approach described here: https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/

describe('findLargestPossibleRoom', () => {

	const paramsIllegalContent = [
		[2, 		[[1,1,1,1],
					 [1,1,1,1],
					 [1,2,1,1],
					 [1,1,1,1]]],
		[-1, 		[[1,1,1,1],
					 [1,1,1,1],
					 [1,1,1,1],
					 [1,1,-1,1]]],
		[0.1, 		[[1,1,1,1],
					 [1,1,1,1],
					 [0.1,1,1,1],
					 [1,1,1,1]]],
		[null,		[[1,1,1,1],
					 [1,1,1,1],
					 [1,1,1,1],
					 [null,1,1,1]]],
		[undefined, [[1,1,1,1],
					 [1,1,1,1],
					 [1,undefined,1,1],
					 [1,1,1,1]]],
		[NaN, 		[[1,1,1,1],
					 [1,1,1,1],
					 [1,1,NaN,1],
					 [1,1,1,1]]],
	];

	test.each(paramsIllegalContent)(
		"grid character %s in grid is illegal",
		(wrongContent, grid) => {
			expect(() => findLargestPossibleRoom(grid))
			.toThrow("only 0 and 1 allowed");		
			expect(() => findLargestPossibleRoom(transpose(grid)))
			.toThrow("only 0 and 1 allowed");			
		}
	);

	test('shape wrong', () => {
		expect(() => findLargestPossibleRoom([[1,1,1,1,1],
											  [1,1,1,1],
											  [1,1,1,1],
											  [1,1,1,1]]))
		.toThrow("irregular grid");
		expect(() => findLargestPossibleRoom([[1,1,1,1],
											  [1,1,1,1],
											  [1,1,1,1,1],
											  [1,1,1,1]]))
		.toThrow("irregular grid");
	});

	const paramsLevelTooSmall = [
		[[]],
		[[[1]]],
		[[[0,0],[0,0]]],
		[[[1,1],[1,1]]],
		[[[0,1],[1,0]]],
		[[[1,1],[0,0]]],
		[[[1,1,1],[1,1,1]]],
		[[[1,1],[1,1],[1,1]]],

		[[[1,1,1],
		  [1,1,1],
		  [1,1,0]]],
		
		[[[1,1,1],
		  [1,1,1],
		  [1,1,1]]],
		
		[[[1,1,1],
		  [1,1,1],
		  [1,1,1],
		  [1,1,1]]],
		
		[[[1,1,0],
		  [1,1,1],
		  [1,1,1],
		  [1,1,1]]],
	];

	test.each(paramsLevelTooSmall)(
		"grid %o is too small",
		(grid) => {
			expect(() => findLargestPossibleRoom(transpose(grid)))
			.toThrow("grid is smaller than 4x4");			
			expect(() => findLargestPossibleRoom(grid))
			.toThrow("grid is smaller than 4x4");
		}
	);
	
	const paramsValidResult = [
		[ 
			'4x4 success 2x2',
			[[1,1,1,1],
			 [1,1,1,1],
			 [1,1,1,1],
			 [1,1,1,1]],
			[1,1,2,2]
		],[
			'4x4 taken',
			[[1,1,1,1],
			 [1,0,1,1],
			 [1,1,1,1],
			 [1,1,1,1]],
			[0,0,0,0]
		],[ 
			'4x4 blocked 0,0',
			[[0,1,1,1],
			 [1,1,1,1],
			 [1,1,1,1],
			 [1,1,1,1]],
			[0,0,0,0]
		],[
			'4x4 blocked 1,0',
			[[1,0,1,1],
			 [1,1,1,1],
			 [1,1,1,1],
			 [1,1,1,1]],
			[0,0,0,0]
		],[
			'4x4 blocked 2,0',
			[[1,1,0,1],
			 [1,1,1,1],
			 [1,1,1,1],
			 [1,1,1,1]],
			[0,0,0,0]
		],[
			'5x5 success 3x3',
			[[1,1,1,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,1]],
			[1,1,3,3]
		],[
			'5x5 blocked 1,1',
			[[1,1,1,1,1],
			 [1,0,1,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,1]],
			[0,0,0,0]
		],[
			'5x5 blocked 2,1',
			[[1,1,1,1,1],
			 [1,1,0,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,1]],
			[0,0,0,0]
		],[
			'5x5 success 2x3',
			[[1,1,1,0,0],
			 [1,1,1,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,1]],
			[2,1,2,3]
		],[
			'5x5 success 3x2',
			[[1,1,1,1,1],
			 [1,1,1,1,1],
			 [1,1,1,1,0],
			 [1,1,1,1,1],
			 [1,1,1,1,1]],
			[1,1,3,2]
		],[
			'7x7 success 4x2',
			[[1,1,1,1,1,1,1],
			 [1,0,0,1,1,1,1],
			 [1,0,0,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,0,1,1]],
			[1,4,4,2]
		],[
			'7x7 failure',
			[[1,1,1,0,1,1,1],
			 [1,0,0,1,1,1,1],
			 [1,0,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,0,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,0,1,1,1]],
			[0,0,0,0]
		],[
			'7x4 failure',
			[[1,1,1,1,1,1,1],
			 [1,1,1,1,0,1,1],
			 [1,0,1,1,1,1,1],
			 [1,1,1,1,1,1,1]],
			[0,0,0,0]
		],[
			'7x4 success 2x2',
			[[1,1,1,1,0,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1]],
			[1,1,2,2]
		],[
			'7x10 success 2x5',
			[[1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,0,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,0,0,0,0,0,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1]],
			[7,1,2,5]
		],[
			'7x10 success 3x3',
			[[1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,0,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,0,0,0,0,0,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,1],
			 [1,1,1,1,1,1,0]],
			[1,1,3,3]
		]
	]

	test.each(paramsValidResult)(
		"%s",
		(description, grid, expectedResult) => {
			debugger;			
			expect(findLargestPossibleRoom(grid)).toMatchObject(expectedResult);
		}
	);

	test.each(paramsValidResult)(
		"transposed %s",
		(description, grid, expectedResult) => {
			var x,y,width,height;
			[x,y,width,height] = expectedResult;
			expect(findLargestPossibleRoom(grid)).toMatchObject([y,x,height,width]);
		}
	);

});
