const SPRITEWIDTH = 32;
const SPRITEHEIGHT = 32;
const GRIDWIDTH = 30;
const GRIDHEIGHT = 16;
const BOMBMAX = 99;
const WIDTH = GRIDWIDTH * SPRITEWIDTH;
const HEIGHT = GRIDHEIGHT * SPRITEHEIGHT;
const BOMB = 1;
const EMPTY = 0;

class Tile extends PIXI.Sprite {
	constructor(a, b, c) {
		super();
		this.gridx = a;
		this.gridy = b;
		this.main = c;

		this.flagged = false;
		this.done = false;

		this.x = this.gridx * SPRITEWIDTH;
		this.y = this.gridy * SPRITEHEIGHT;

		// binds the function 'onClick' to the pointerdown call
		this.on('pointerdown', this.onClick.bind(this));
		this.on('pointerup', this.onRelease.bind(this));
		this.on('pointerout', this.onPointerLeave.bind(this));
		this.on('pointerover', this.onPointerEnter.bind(this));

		this.tileUnpressed = PIXI.Sprite.from('img/TileDefault.png');
		this.tilePressed = PIXI.Sprite.from('img/TilePressed.png');
		this.tileFlag = PIXI.Sprite.from('img/TileFlag.png');

		this.addChild(this.tileUnpressed);
		this.currentSprite = this.tileUnpressed;

		// lets you interact with sprite
		this.interactive = true;
	}

	setSprite() {
		let tileIMG = 'img/Tile' + this.adj + '.png';
		this.tileReleased = PIXI.Sprite.from(tileIMG);
	}

	changeSprite(newSprite) {
		if (this.currentSprite === newSprite || this.flagged) { return; }

		this.removeChild(this.currentSprite);
		this.addChild(newSprite);
		this.currentSprite = newSprite;
	}

	reset() {
		this.done = false;
		if (this.flagged) {
			this.removeChild(this.tileFlag);
			this.flagged = false;
		}
		this.changeSprite(this.tileUnpressed);
	}

	onClick(event) {
		if (this.done) return;

		let button = event.data.buttons;

		if (button & 1) {
			this.changeSprite(this.tilePressed);
		}
		else if (button & 2) {
			if (this.flagged) {
				this.removeChild(this.tileFlag);
				this.main.currentBombs++;
				document.getElementById('bombText').innerHTML = this.main.currentBombs;
			} else {
				this.addChild(this.tileFlag);
				this.main.currentBombs--;
				document.getElementById('bombText').innerHTML = this.main.currentBombs;
			}

			this.flagged = !this.flagged;
		}
	}

	onRelease(event) {
		if (event.data.button === 0) {
			if (this.main.firstClick === true) {
				this.main.firstClick = false;
				this.main.createBombArray(this.gridx, this.gridy);
				this.main.setTileValues();
			}
			this.exposeTiles();
		}
	}

	onPointerLeave() {
		if (this.done) return;
		this.changeSprite(this.tileUnpressed);
	}

	onPointerEnter(event) {
		if (this.done) return;
		if (event.data.buttons & 1) {
			this.changeSprite(this.tilePressed);
		}
	}

	exposeTiles() {
		if (this.gridx < 0 || this.gridx >= GRIDWIDTH || this.gridy < 0 || this.gridy >= GRIDHEIGHT) { return; }
		if (this.done || this.flagged) { return; }

		this.changeSprite(this.tileReleased);
		this.done = true;

		if (this.type) {
			alert('you are ded, not big surprise');
			this.main.freezeTiles();
		}

		if (this.adj === 0) {
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
		let tile = getTile(this.gridx + xoffset, this.gridy + yoffset, this.main);
		if (tile !== null) {
			tile.exposeTiles();
		}
	}
}

function getTile(x, y, main) {
	if(x >= 0 && x < main.gameArray.length) {
		if(y >= 0 && y < main.gameArray[x].length) {
			return main.gameArray[x][y];
		}
	}
	return null;
}

function getTileType(x, y, main) {
	let tile = getTile(x, y, main);
	return (tile === null) ? null : tile.type;
}
