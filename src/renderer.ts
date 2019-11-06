import { Point } from "./data";
import { Room } from "./room";

export class Renderer {
    constructor (
        private ctx: CanvasRenderingContext2D,
        private scale: number) {
        }

    public PointToScreen(p: Point) {
        return [p.x * this.scale, p.y * this.scale]
    }

    public PointFromScreen(s: [number, number]) {
        let tx = Math.floor(s[0] / this.scale);
        let ty = Math.floor(s[1] / this.scale);
        return Point.Make(tx, ty);
    }

    public Write(text: string, p: Point) {
        let s = this.PointToScreen(p);
        this.ctx.fillText(text, s[0], s[1]);
    }

    public DrawRoom(room: Room) {
        for (var x = 0; x < room.width; x++) {
            for (var y = 0; y < room.height; y++) {
                let p = Point.Make(x, y);
                this.Draw(room, p);
            }
        }
    }

    public Draw(room: Room, p: Point) {
        const tile = room.TileAt(p);
        const xy = this.PointToScreen(p);
        this.ctx.fillStyle = tile.hasMine ? '#a22' : tile.isRevealed ? '#888' : '#aaa';
        this.ctx.strokeStyle = '#000';
        this.ctx.fillRect(xy[0], xy[1], this.scale, this.scale);
        this.ctx.strokeRect(xy[0], xy[1], this.scale, this.scale);
    }
}
