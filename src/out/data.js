"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = /** @class */ (function () {
    function Point(x, y, levelx, levely) {
        this.x = x;
        this.y = y;
        this.levelx = levelx;
        this.levely = levely;
    }
    Point.Make = function (x, y) {
        return new Point(x, y, 1, 1);
    };
    Point.prototype.ToString = function () {
        return "(" + this.x + ", " + this.y + ")";
    };
    return Point;
}());
exports.Point = Point;
