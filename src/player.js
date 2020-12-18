import { Color, Direction } from './engine-types.js';

const HEAL_DELAY = 10;

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
		this.health=3;
		this.maxHealth=5;
		this.magic = 1;
		this.maxMagic=2;				
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
			if(this.healCounter == 0){
				if(this.health < this.maxHealth)
					this.health++;
				if(this.magic < this.maxMagic)
					this.magic++;
				this.healCounter = HEAL_DELAY;
			} else {
				this.healCounter--;
			}
		}
		return result;
	}

	
	paintStatus(game, width) {
		for(var i=0; i<width; i++) {
			game.setDot(i, 1, Color.Black);	  
		}
		for(var i=0; i<width; i++) {
			game.setDot(i, 0, Color.Black);
				
			if(i<this.maxHealth) {
				game.setDot(i, 0, Color.Gray);
			}
			if(i<this.health) {
				game.setDot(i, 0, Color.Red);
			}

			if(width-i <= this.maxMagic) {
				game.setDot(i, 0, Color.Gray);
			}
			if(width-i <= this.magic) {
				game.setDot(i, 0, Color.Blue);
			}
		}
	}
}

export {Player}