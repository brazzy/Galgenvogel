import { Color, Direction } from './engine-types.js';
import { Being } from './being.js';

class Monster extends Being{
	constructor(color, health, damage, perceptionRadius) {
		super(color, health, damage);
		this.perceptionRadius = perceptionRadius;
	}
	
	move(level) {
		const distance = level.distanceToTarget(this)
		if(distance <= this.perceptionRadius) {
			const blocker = level.moveTowardsTarget(this)
			if(blocker && blocker.isPlayer){
				this.attack(blocker);
			}
		}
	}
}

export {Monster}