import { Point } from "./data";
import { Room } from "./room";
import { Game } from "./game";

export class Renderer {
    constructor (
        private canvas: HTMLCanvasElement,
        private scale: number) {
            let context = canvas.getContext('2d');
            if (!context) {
                throw "Unable to retrieve CanvasRenderingContext2D";
            }
            context.font = '18px monospace';
            this.context = context;
            let that = this;
            this.canvas.onclick = function(ev: MouseEvent) {
                if (!that.currentRoom)
                    return;
                let rect = that.canvas.getBoundingClientRect();
                let rightEdge = rect.left + that.currentRoom.width * that.scale;
                let bottomEdge = rect.top + that.currentRoom.height * that.scale;
                console.log(`click ${ev.x},${ev.y} over rect ${rect.left}-${rect.right} x ${rect.top}-${rect.bottom}`);
                if (ev.x < rect.left || ev.x >= rightEdge || ev.y < rect.top || ev.y >= bottomEdge) {
                    return;
                }
                let x = ev.x - rect.left;
                let y = ev.y - rect.top;
                let point = that.PointFromScreen([x, y]);
                that.OnCanvasClicked(point);
            }
        }
    private context: CanvasRenderingContext2D;
    public GameCallback?: Game;
    public currentRoom?: Room; // this is needed only for point calculation in onclick. I don't really want to have a reference to game logic here, though.

    public PointToScreen(p: Point) {
        return [p.x * this.scale, p.y * this.scale]
    }

    public PointFromScreen(s: [number, number]) {
        let tx = Math.floor(s[0] / this.scale);
        let ty = Math.floor(s[1] / this.scale);
        return Point.Make(tx, ty);
    }

    private OnCanvasClicked(p: Point) {
        if (this.GameCallback) {
            this.GameCallback.OnTileClicked(p);
        }
    }

    public Write(text: string, p: Point) {
        let s = this.PointToScreen(p);
        this.context.fillStyle = `#222`;
        this.context.fillText(text, s[0] + this.scale*0.3, s[1] + this.scale*0.8);
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
        this.context.fillStyle = tile.hasMine ? '#a22' : tile.isRevealed ? '#999' : '#ccc';
        this.context.strokeStyle = tile.isRevealed ? '#909090' : '#777';
        this.context.fillRect(xy[0], xy[1], this.scale, this.scale);
        this.context.strokeRect(xy[0], xy[1], this.scale, this.scale);
        if (tile.score > 0 && !tile.hasMine)
            this.Write(tile.score.toString(), p);
    }

    public DrawPoints(room: Room, points: Point[]) {
        points.forEach(p => {
            this.Draw(room, p);
        });
    }
}
