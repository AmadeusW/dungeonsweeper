"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var Game = /** @class */ (function () {
    function Game(renderer) {
        this.renderer = renderer;
        this.playing = false;
        this.initialized = false;
    }
    Game.prototype.Initialize = function () {
        if (this.initialized) {
            return;
        }
        var game = this;
        document.onkeydown = function (e) {
            var code = e.keyCode;
            game.Debug("Keydown: " + code);
            if (code == 13) {
                game.HandleReturn();
            }
        };
        this.initialized = true;
    };
    Game.prototype.Debug = function (message) {
        console.log(message);
    };
    Game.prototype.HandleReturn = function () {
        this.Debug("Return pressed");
    };
    Game.prototype.OpenMenu = function (menuName) {
        if (menuName == "main") {
            this.renderer.Write("Dungeon Sweeper", data_1.Point.Make(10, 1));
            this.renderer.Write("Use your minesweeping skills to find your way out of captivity and search for the legendary treasure.", data_1.Point.Make(1, 2));
            this.renderer.Write("Press Enter to play.", data_1.Point.Make(5, 3));
        }
    };
    Game.prototype.Start = function () {
        this.playing = true;
        var p = data_1.Point.Make(3, 3);
        this.renderer.Write("hi", p);
    };
    return Game;
}());
exports.Game = Game;
