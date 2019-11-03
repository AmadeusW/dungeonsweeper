"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var Renderer = /** @class */ (function () {
    function Renderer(ctx, scale) {
        this.ctx = ctx;
        this.scale = scale;
    }
    Renderer.prototype.PointToScreen = function (p) {
        return [p.x * this.scale, p.y * this.scale];
    };
    Renderer.prototype.PointFromScreen = function (s) {
        var tx = Math.floor(s[0] / this.scale);
        var ty = Math.floor(s[1] / this.scale);
        return data_1.Point.Make(tx, ty);
    };
    Renderer.prototype.Write = function (text, p) {
        var s = this.PointToScreen(p);
        this.ctx.fillText(text, s[0], s[1]);
    };
    return Renderer;
}());
exports.Renderer = Renderer;
