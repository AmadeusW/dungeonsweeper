import { Renderer } from "./renderer";
import { Game } from "./game";

console.log("Dungeon Sweeper startup");
const element = document.getElementById('debug');
if (element)
    element.innerText = "Dungeon Sweeper";

const canvas = (<HTMLCanvasElement>document.getElementById('displayHost'));
const playButton = (<HTMLButtonElement>document.getElementById('playButton'))
if (canvas) {
    let scale = 20;
    let renderer = new Renderer(canvas, scale);
    
    let game = new Game(renderer);
    game.Initialize();
    game.OpenMenu("main");
    if (playButton) {
        playButton.onclick = () => game.Start();
    }
}

