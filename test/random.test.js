import { randomInt, randomCoords } from '../src/random.js';

describe('randomInt', () => {
	
	test('keeps bounds for size 1', () => {
		for (let i=0; i<20; i++) {
			expect(randomInt(1)).toBe(0);			
		}
	});
	test('keeps bounds for size 2', () => {
		for (let i=0; i<20; i++) {
			var result = randomInt(2);
			expect(result).toBeGreaterThanOrEqual(0)
			expect(result).toBeLessThan(2);			
		}
	});
	test('keeps bounds for size 10', () => {
		for (let i=0; i<100; i++) {
			var result = randomInt(10);
			expect(result).toBeGreaterThanOrEqual(0)
			expect(result).toBeLessThan(10);			
		}
	});

	test('covers size 10', () => {
		const results = Array(10).fill(0);
		for (let i=0; i<1000; i++) {
			results[randomInt(10)]++;			
		}
		console.log(results);
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
			var [x, y] = randomCoords(2,3);
			expect(x).toBeGreaterThanOrEqual(0);
			expect(x).toBeLessThan(2);
			expect(y).toBeGreaterThanOrEqual(0);
			expect(y).toBeLessThan(3);
		}
	});
});