import { Color } from './engine-types.js';

class Being {
	constructor(color, health, damage) {
		this.spotTaken = true;
		this.color = color;
		this.health=health;
		this.damage=damage;
		this.x = null;
		this.y = null;
	}
	
	hurt(amount) {
		this.health -= amount;
	}
	
	isAlive() {
		return this.health > 0;
	}
	
	attack(other) {
		other.hurt(this.damage);
	}
}

export {Being}