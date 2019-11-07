import { Point } from "./data";
import { Room } from "./room";

export class Renderer {
    constructor (
        private canvas: HTMLCanvasElement,
        private scale: number) {
            let context = canvas.getContext('2d');
            if (!context) {
                throw "Unable to retrieve CanvasRenderingContext2D";
            }
            context.font = '20px monospace';
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
    private currentRoom?: Room;

    public PointToScreen(p: Point) {
        return [p.x * this.scale, p.y * this.scale]
    }

    public PointFromScreen(s: [number, number]) {
        let tx = Math.floor(s[0] / this.scale);
        let ty = Math.floor(s[1] / this.scale);
        return Point.Make(tx, ty);
    }

    private OnCanvasClicked(p: Point) {
        if (!this.currentRoom) {
            return;
        }
        if (!this.currentRoom.IsInitialized) {
            this.currentRoom.Initialize();
        }
        let clickedTile = this.currentRoom.TileAt(p);
        clickedTile.isRevealed = true;
        this.Draw(this.currentRoom, p);
    }

    public Write(text: string, p: Point) {
        let s = this.PointToScreen(p);
        this.context.fillStyle = `#222`;
        this.context.fillText(text, s[0] + this.scale*0.3, s[1] + this.scale*0.8);
    }

    public SetRoom(room: Room) {
        this.currentRoom = room;
    }

    public DrawRoom() {
        if (!this.currentRoom) {
            return;
        }
        for (var x = 0; x < this.currentRoom.width; x++) {
            for (var y = 0; y < this.currentRoom.height; y++) {
                let p = Point.Make(x, y);
                this.Draw(this.currentRoom, p);
            }
        }
    }

    public Draw(room: Room, p: Point) {
        const tile = room.TileAt(p);
        const xy = this.PointToScreen(p);
        this.context.fillStyle = tile.hasMine ? '#a22' : tile.isRevealed ? '#888' : '#aaa';
        this.context.strokeStyle = '#000';
        this.context.fillRect(xy[0], xy[1], this.scale, this.scale);
        this.context.strokeRect(xy[0], xy[1], this.scale, this.scale);
        this.Write(tile.score.toString(), p);
    }
}
