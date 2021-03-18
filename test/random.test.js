import { RANDOM } from '../src/random.js';

describe('randomInt', () => {
	
	test('keeps bounds for size 1', () => {
		for (let i=0; i<20; i++) {
			expect(RANDOM.int(1)).toBe(0);
		}
	});
	test('keeps bounds for size 2', () => {
		for (let i=0; i<20; i++) {
			var result = RANDOM.int(2);
			expect(result).toBeGreaterThanOrEqual(0)
			expect(result).toBeLessThan(2);			
		}
	});
	test('keeps bounds for size 10', () => {
		for (let i=0; i<100; i++) {
			var result = RANDOM.int(10);
			expect(result).toBeGreaterThanOrEqual(0)
			expect(result).toBeLessThan(10);			
		}
	});

	test('covers size 10', () => {
		const results = Array(10).fill(0);
		for (let i=0; i<1000; i++) {
			results[RANDOM.int(10)]++;
		}
		expect(results.length).toBe(10);
		expect(results.length).not.toContain(0);
		expect(results.length).not.toContain(1);
		expect(results.length).not.toContain(null);
		expect(results.length).not.toContain(undefined);
		expect(results.length).not.toContain(NaN);

	});

});

describe('randomCoords', () => {
	test('keeps Bounds', () => {
		for (let i=0; i<100; i++) {
			var [x, y] = RANDOM.coords(2,3);
			expect(x).toBeGreaterThanOrEqual(0);
			expect(x).toBeLessThan(2);
			expect(y).toBeGreaterThanOrEqual(0);
			expect(y).toBeLessThan(3);
		}
	});
});

describe('shuffle', () => {
	test('works for trivial cases', () => {
	    expect(RANDOM.shuffle([])).toMatchObject([]);
	    expect(RANDOM.shuffle([1])).toMatchObject([1]);
	});
	test('covers all permutations', () => {
    	const set = new Set();
		for (let i=0; i<50; i++) {
		    set.add(RANDOM.shuffle([1,2,3]).toString());
		}
		expect(set.size).toBe(6);
        expect(set.has("1,2,3")).toBe(true);
		expect(set.has("1,3,2")).toBe(true);
		expect(set.has("2,1,3")).toBe(true);
		expect(set.has("2,3,1")).toBe(true);
		expect(set.has("3,1,2")).toBe(true);
		expect(set.has("3,2,1")).toBe(true);
	});
});