
class Tile extends PIXI.Sprite {
	constructor(a, b, c) {
		super();
		this.gridx = a;
		this.gridy = b;
		this.type = c;

		this.done = false;

		this.x = this.gridx * SPRITEWIDTH;
		this.y = this.gridy * SPRITEHEIGHT;

		// binds the function 'onClick' to the pointerdown call
		this.on('pointerdown', this.onClick.bind(this));
		this.on('pointerup', this.onRelease.bind(this));
		this.on('pointerout', this.onPointerLeave.bind(this));
		this.on('pointerover', this.onPointerEnter.bind(this));

		// lets you interact with sprite
		this.interactive = true;
	}

	setSprite() {

		let tileIMG = 'img/Tile' + this.adj + '.png';
		this.tileReleased = PIXI.Sprite.from(tileIMG);
		this.tileUnpressed = PIXI.Sprite.from('img/TileDefault.png');
		this.tilePressed = PIXI.Sprite.from('img/TilePressed.png');

		this.addChild(this.tileUnpressed);
	}

	onClick() {
		if (this.done) return;

		this.removeChild(this.children[0]);
		this.addChild(this.tilePressed);
	}

	onRelease() {
		this.exposeTiles();
	}

	onPointerLeave() {
		if (this.done) return;
		if (this.type === BOMB) {return;} // temperarary

		this.removeChild(this.children[0]);
		this.addChild(this.tileUnpressed);
	}

	onPointerEnter(event) {
		if (this.done) return;
		if (event.data.buttons & 1) {
			this.removeChild(this.children[0]);
			this.addChild(this.tilePressed);
		}
	}

	exposeTiles() {
		if (this.gridx < 0 || this.gridx >= GRIDWIDTH || this.gridy < 0 || this.gridy >= GRIDHEIGHT) { return; }
		if (this.done) { return; }

		// set sprite to what it is supposed to be
		this.removeChild(this.children[0]);
		this.addChild(this.tileReleased);
		this.done = true;

		if (!this.adj) {
			this.recursionCheck(-1, -1);
			this.recursionCheck(-1, 0);
			this.recursionCheck(-1, 1);
			this.recursionCheck(1, -1);
			this.recursionCheck(1, 0);
			this.recursionCheck(1, 1);
			this.recursionCheck(0, -1);
			this.recursionCheck(0, 1);
		}
	}

	recursionCheck(xoffset, yoffset) {
		let tile = getTile(this.gridx + xoffset, this.gridy + yoffset);
		if (tile !== null) {
			tile.exposeTiles();
		}
	}
}


function getTile(x, y) {
    if(x >= 0 && x < gameArray.length) {
        if(y >= 0 && y < gameArray[x].length) {
            return gameArray[x][y];
        }
    }
    return null;
}

function getTileType(x, y) {
	 if(x >= 0 && x < gameArray.length) {
        if(y >= 0 && y < gameArray[x].length) {
            return gameArray[x][y].type;
        }
    }
    return null;
}
