import { Color, Direction } from './engine-types.js';
import { Being } from './being.js';

const HEAL_DELAY = 10;
const HEALTH_START = 3;
const HEALTH_MAX = 5;
const MAGIC_START = 1;
const MAGIC_MAX = 2;


class Player extends Being{
	constructor(colorCycle){
		super(Color.Green, HEALTH_START, 1);
		this._colorCycle = colorCycle;
		this._colorCount = colorCycle;
		
		this.isPlayer = true;
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
	
	set color(c){}
	
	init() {
		this.healCounter = HEAL_DELAY;
		this.maxHealth = HEALTH_MAX;
		this.magic = MAGIC_START;
		this.maxMagic = MAGIC_MAX;
	}
	
	cast(level, x, y) {
		if(this.magic > 0) {
			const target = level.get(x, y);
			if(target.isPlayer) {
				level.remove(this);
				level.placeRandomly(this);
				this.magic--;
				return true;
			} else if (target.health){
				target.hurt(2);
				this.magic--;
				return true;
			}
		}
		return false;
	}
	
	move(level, direction) {
		const blocker = level.move(this, direction);
		var result;
		if(blocker) {
			if(blocker.health) {
				this.attack(blocker);
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
		for(var x=0; x<width; x++) {
			game.setDot(x, 1, Color.Black);	  
		}
		for(var x=0; x<width; x++) {
			if(x<this.health) {
				game.setDot(x, 0, Color.Red);
			} else if(x<this.maxHealth) {
				game.setDot(x, 0, Color.Gray);
			} else if(width-x <= this.magic) {
				game.setDot(x, 0, Color.Blue);
			} else if(width-x <= this.maxMagic) {
				game.setDot(x, 0, Color.Gray);
			} else {
				game.setDot(x, 0, Color.Black);				
			}

		}
	}
}

export {Player, HEAL_DELAY, HEALTH_START, HEALTH_MAX, MAGIC_START, MAGIC_MAX}