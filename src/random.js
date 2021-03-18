class Random {
    constructor(seed=Math.random()*0xF0000000) {
        this.reseed(seed);
    }

    reseed(seed) {
        this.state = seed;
    }

    /**
     * Since we can't seed Javascript's Math.random() we use our own to get something reproducible.
     * See https://stackoverflow.com/a/47593316/16883
     */
    mulberry32() {
      var t = this.state += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    /**
     * Returns a random integer between 0 (inclusive) and maxExclusive.
     */
    int(maxExclusive) {
        return Math.floor(this.mulberry32()*maxExclusive);
    }

    /**
     * Returns a random coordinate within a grid of the given width and height as an [x,y] array. Usage:
     * [x, y] = randomCoords(width, height);
     */
    coords(width, height) {
        return [this.int(width), this.int(height)];
    }

    /**
     * Durstenfeld algorithm taken from https://stackoverflow.com/a/12646864/16883
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(this.mulberry32() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

const RANDOM = new Random()

export {Random, RANDOM}