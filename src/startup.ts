import { Renderer } from "./renderer";
import { Game } from "./game";

console.log("Dungeon Sweeper startup");
const element = document.getElementById('debug');
if (element)
    element.innerText = "Dungeon Sweeper";

const context = (<HTMLCanvasElement>document.getElementById('displayHost')).getContext('2d');
if (context) {
    let scale = 20;
    let renderer = new Renderer(context, scale);
    
    context.font = '20px monospace';
    let game = new Game(renderer);
    game.Initialize();
    game.OpenMenu("main");
}

