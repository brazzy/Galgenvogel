import { Color, Direction } from './engine-types.js';

class Player {
	constructor(colorCycle){
		this._colorCycle = colorCycle;
		this._colorCount = colorCycle;
		
		this.spotTaken = true,
		this.health=3;
		this.maxHealth=5;
		this.magic = 1;
		this.maxMagic=2;		
		this.x=0;
		this.y=0;
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
	
	paintStatus(game, width) {
		for(var i=0; i<width; i++) {
			game.setDot(i, 1, Color.Black);	  
		}
		for(var i=0; i<width; i++) {
			game.setDot(i, 0, Color.Gray);
				
			if(i<this.maxHealth) {
				game.setDot(i, 0, Color.Red);
			}
			if(i<this.health) {
				game.setDot(i, 0, Color.Orange);
			}

			if(width-i <= this.maxMagic) {
				game.setDot(i, 0, Color.Indigo);
			}
			if(width-i <= this.magic) {
				game.setDot(i, 0, Color.Blue);
			}
		}
	}
}

export {Player}