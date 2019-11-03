"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("./renderer");
var game_1 = require("./game");
// @ts-ignore: Property 'getContext' does not exist on type 'HTMLElement'.
var ctx = document.getElementById('displayHost').getContext('2d');
var scale = 20;
var renderer = new renderer_1.Renderer(ctx, scale);
ctx.font = '20px monospace';
var game = new game_1.Game(renderer);
game.Initialize();
game.OpenMenu("main");
