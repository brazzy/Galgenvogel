import { Color, Direction } from './engine-types.js';

const HEAL_DELAY = 10;
const HEALTH_START = 3;
const HEALTH_MAX = 5;
const MAGIC_START = 1;
const MAGIC_MAX = 2;


class Player {
	constructor(colorCycle){
		this._colorCycle = colorCycle;
		this._colorCount = colorCycle;
		
		this.isPlayer = true;
		this.spotTaken = true;
		this.x=null;
		this.y=null;
		this.init();
	}

	get color() {
		if(this._colorCount === 0) {
			this._colorCount = this._colorCycle;			  
			return Color.Gray;
		} else {
			this._colorCount--
			return Color.Green;
		}
	}
	
	init() {
		this.healCounter = HEAL_DELAY;
		this.health=HEALTH_START;
		this.maxHealth=HEALTH_MAX;
		this.magic = MAGIC_START;
		this.maxMagic=MAGIC_MAX;
	}
	
	move(level, direction) {
		const blocker = level.move(this, direction);
		var result;
		if(blocker) {
			if(blocker.health) {
				blocker.health--;
				result = true;
			} else {
				result = false;
			}
		} else {
			level.setTarget(this);
			result = true;
		}
		if(result) {
			if(--this.healCounter == 0){
				if(this.health < this.maxHealth)
					this.health++;
				if(this.magic < this.maxMagic)
					this.magic++;
				this.healCounter = HEAL_DELAY;
			}
		}
		return result;
	}

	
	paintStatus(game, width) {
		for(var i=0; i<width; i++) {
			game.setDot(i, 1, Color.Black);	  
		}
		for(var i=0; i<width; i++) {
			if(i<this.health) {
				game.setDot(i, 0, Color.Red);
			} else if(i<this.maxHealth) {
				game.setDot(i, 0, Color.Gray);
			} else if(width-i <= this.magic) {
				game.setDot(i, 0, Color.Blue);
			} else if(width-i <= this.maxMagic) {
				game.setDot(i, 0, Color.Gray);
			} else {
				game.setDot(i, 0, Color.Black);				
			}

		}
	}
}

export {Player, HEAL_DELAY, HEALTH_START, HEALTH_MAX, MAGIC_START, MAGIC_MAX}