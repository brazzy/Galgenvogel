import { Color, Direction } from './engine-types.js';

class Monster {
	constructor() {
		this.spotTaken = true,
		this.color = Color.Yellow
		this.health=2;
		this.x = null;
		this.y = null;
	}
	
	move(level) {
		const blocker = level.moveTowardsTarget(this)
		if(blocker && blocker.isPlayer){
			blocker.health--;
		}
	}
}

export {Monster}