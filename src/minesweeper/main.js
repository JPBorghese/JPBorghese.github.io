

// diable the add in the console
PIXI.utils.skipHello();

// disable right click menu
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

let main = new Main();
main.createGameArray();
