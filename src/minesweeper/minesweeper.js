
class Main {

	constructor() {
		this.WIDTH = 1920;
		this.HEIGHT = 1024;
		this.currentBombs = BOMBMAX;
		this.firstClick = true;
		this.bombs = [];

		this.app = new PIXI.Application({
			width: WIDTH,
			height: HEIGHT,
			antialising: false,
			transparent: false,
			resolution: 1,
			view: document.getElementById('canvas')
		});

		this.graphics = new PIXI.Graphics();
		this.app.stage.addChild(this.graphics);

		//this.app.ticker.add(this.update.bind(this));
	}

	resetGame() {
		// reset bomb counter
		document.getElementById('bombText').innerHTML = BOMBMAX;
		this.currentBombs = BOMBMAX;

		// reset the tiles
		this.firstClick = true;
		for (let x = 0; x < GRIDWIDTH; x++) {
			for (let y = 0; y < GRIDHEIGHT; y++) {
				this.gameArray[x][y].reset();
			}
		}
	}

	createBombArray(x, y) {
		// clears the array
		this.bombs.length = 0;

		let reserved = [];
		for (let a = x - 1; a <= x + 1; a++) {
			for (let b = y - 1; b <= y + 1; b++) {
				if (a >= 0 && b >= 0) {
					reserved.push(a + b * GRIDWIDTH);
				}
			}
		}

		for (let i = 0; i < BOMBMAX; i++) {
			let index = -1;
			do {
				index = Math.floor(GRIDWIDTH * GRIDHEIGHT * Math.random());
			} while(this.bombs.indexOf(index) >= 0 || reserved.indexOf(index) >= 0);
			this.bombs.push(index);
		}
	}

	createGameArray() {
		this.gameArray = [];

		for (let x = 0; x < GRIDWIDTH; x++) {
			this.gameArray[x] = [];

			for (let y = 0; y < GRIDHEIGHT; y++) {
				this.gameArray[x][y] = new Tile(x, y, this);
				this.app.stage.addChild(this.gameArray[x][y]);
			}
		}
	}

	setTileValues() {

		for (let x = 0; x < GRIDWIDTH; x++) {
			for (let y = 0; y < GRIDHEIGHT; y++) {
				let type = EMPTY;

				if (this.bombs.indexOf(x + y * GRIDWIDTH) >= 0) {
					type = BOMB;
				}

				this.gameArray[x][y].type = type;
			}
		}

		for (let y = 0; y < GRIDHEIGHT; y++) {
			for (let x = 0; x < GRIDWIDTH; x++) {

				if (getTileType(x, y, this) === BOMB) {
					let tile = getTile(x, y, this);
					tile.adj = -1;
					tile.setSprite();
					continue;
				}

				let count = 0;

				if (getTileType(x-1, y-1, this)) { count++; }
				if (getTileType(x-1, y, this)) { count++; }
				if (getTileType(x-1, y+1, this)) { count++; }
				if (getTileType(x, y-1, this)) { count++; }
				if (getTileType(x, y+1, this)) { count++; }
				if (getTileType(x+1, y-1, this)) { count++; }
				if (getTileType(x+1, y, this)) { count++; }
				if (getTileType(x+1, y+1, this)) { count++; }

				let tile = getTile(x, y, this);

				tile.adj = count;
				tile.setSprite();
			}
		}
	}

	freezeTiles() {
		for (let x = 0; x < GRIDWIDTH; x++) {
			for (let y = 0; y < GRIDHEIGHT; y++) {
				this.gameArray[x][y].done = true;
			}
		}
	}
}

function resetClicked() {
	main.resetGame();
}
