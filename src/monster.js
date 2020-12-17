import { Color, Direction } from './engine-types.js';

class Monster {
	constructor(color, health, damage, perceptionRadius) {
		this.spotTaken = true;
		this.color = color;
		this.health=health;
		this.damage=damage;
		this.perceptionRadius = perceptionRadius;
		this.x = null;
		this.y = null;
	}
	
	move(level) {
		const distance = level.distanceToTarget(this)
		if(distance <= this.perceptionRadius) {
			const blocker = level.moveTowardsTarget(this)
			if(blocker && blocker.isPlayer){
				blocker.health -= this.damage;
			}
		}
	}
}

export {Monster}