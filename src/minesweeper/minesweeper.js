
const SPRITEWIDTH	= 32;
const SPRITEHEIGHT = 32;
const GRIDWIDTH = 30;
const GRIDHEIGHT = 16;
const BOMBNUM = 99;
const WIDTH = GRIDWIDTH * SPRITEWIDTH;
const HEIGHT = GRIDHEIGHT * SPRITEHEIGHT;
const BOMB = 1;
const EMPTY = 0;

class Vect3 {
	constructor(a, b, c) {
		this.x = a;
		this.y = b;
		this.z = c;
	}
}

class Main {

	static randColor() {
		return Math.random() * 0xffffff;
	}

	constructor() {
		this.WIDTH = 1920;
		this.HEIGHT = 1024;

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

		this.app.ticker.add(this.update.bind(this));
	}

	update() {

	}
}

// diable the add in the console
PIXI.utils.skipHello();

// disable right click menu
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

let main = new Main();

let bombs = [];

for (let i = 0; i < BOMBNUM; i++) {
	let index = -1;
	do {
		index = Math.floor(GRIDWIDTH * GRIDHEIGHT * Math.random());
	} while(bombs.indexOf(index) >= 0);
	bombs.push(index);
}

let gameArray = [];

for (let x = 0; x < GRIDWIDTH; x++) {
	gameArray[x] = [];

	for (let y = 0; y < GRIDHEIGHT; y++) {
		let type = EMPTY;

		if (bombs.indexOf(x + y * GRIDWIDTH) >= 0) {
			type = BOMB;
		}
		gameArray[x][y] = new Tile(x, y, type);
		main.app.stage.addChild(gameArray[x][y]);
	}
}


for (let y = 0; y < GRIDHEIGHT; y++) {
	for (let x = 0; x < GRIDWIDTH; x++) {

		if (getTileType(x, y) === BOMB) { 
			let tile = getTile(x, y);
			tile.adj = -1;
			tile.setSprite();
			continue;
		}

		let count = 0;

		if (getTileType(x-1, y-1)) { count++; }
		if (getTileType(x-1, y)) { count++; }
		if (getTileType(x-1, y+1)) { count++; }
		if (getTileType(x, y-1)) { count++; }
		if (getTileType(x, y+1)) { count++; }
		if (getTileType(x+1, y-1)) { count++; }
		if (getTileType(x+1, y)) { count++; }
		if (getTileType(x+1, y+1)) { count++; }

		let tile = getTile(x, y);

		tile.adj = count;
		tile.setSprite();
	}
}
