import { Renderer } from "./renderer";
import { Game } from "./game";

// @ts-ignore: Property 'getContext' does not exist on type 'HTMLElement'.
let ctx = document.getElementById('displayHost').getContext('2d');
let scale = 20;
let renderer = new Renderer(ctx, scale);

ctx.font = '20px monospace';
let game = new Game(renderer);
game.Initialize();
game.OpenMenu("main");
