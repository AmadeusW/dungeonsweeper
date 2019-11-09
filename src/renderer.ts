import { Point, Interaction } from "./data";
import { Room } from "./room";
import { Game } from "./game";

export class Renderer {
    constructor (
        private canvas: HTMLCanvasElement,
        private scale: number) {

            // Set up context:
            let context = canvas.getContext('2d');
            if (!context) {
                throw "Unable to retrieve CanvasRenderingContext2D";
            }
            context.font = '18px monospace';
            this.context = context;

            // Set up mouse handler:
            this.leftButtonPressed = false;
            this.rightButtonPressed = false;
            let that = this;
            // TODO: change to onmousedown and onmouseup
            this.canvas.onmousedown = function(ev: MouseEvent) {
                var point = that.TranslateEventToPoint(ev, that);
                if (!point) {
                    return;
                }
                if (ev.button == 0) {
                    that.leftButtonPressed = true;
                }
                if (ev.button == 2) {
                    that.rightButtonPressed = true;
                }
                return false;
            }
            this.canvas.onmouseup = function(ev: MouseEvent) {
                if (!that.GameCallback) {
                    return;
                }
                var point = that.TranslateEventToPoint(ev, that);
                if (!point) {
                    return;
                }
                if (that.leftButtonPressed && that.rightButtonPressed) {
                    that.GameCallback.OnPointInteraction(point, Interaction.Reveal);
                }
                else if (that.leftButtonPressed) {
                    that.GameCallback.OnPointInteraction(point, Interaction.Enter);
                }
                else if (that.rightButtonPressed) {
                    that.GameCallback.OnPointInteraction(point, Interaction.Flag);
                }
                that.leftButtonPressed = false;
                that.rightButtonPressed = false;
                return false;
            }
            this.canvas.oncontextmenu = function(ev: MouseEvent) {
                ev.preventDefault();
                return false;
            }
        }
    private context: CanvasRenderingContext2D;
    public GameCallback?: Game;
    public currentRoom?: Room; // this is needed only for point calculation in onclick. I don't really want to have a reference to game logic here, though.

    private leftButtonPressed: boolean;
    private rightButtonPressed: boolean;

    private TranslateEventToPoint(ev: MouseEvent, renderer: Renderer) {
        if (!renderer.currentRoom)
            return null;
        let rect = renderer.canvas.getBoundingClientRect();
        let rightEdge = rect.left + renderer.currentRoom.width * renderer.scale;
        let bottomEdge = rect.top + renderer.currentRoom.height * renderer.scale;
        console.log(`click ${ev.x},${ev.y} over rect ${rect.left}-${rect.right} x ${rect.top}-${rect.bottom}`);
        if (ev.x < rect.left || ev.x >= rightEdge || ev.y < rect.top || ev.y >= bottomEdge) {
            return null;
        }
        let x = ev.x - rect.left;
        let y = ev.y - rect.top;
        return renderer.PointFromScreen([x, y]);
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
        this.context.fillStyle = `#222`;
        this.context.fillText(text, s[0] + this.scale*0.2, s[1] + this.scale*0.8);
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
        this.context.fillStyle = tile.hasFlag ? '#6a6' : tile.hasMine ? '#a22' : tile.isRevealed ? '#999' : '#ccc';
        this.context.strokeStyle = tile.isRevealed ? '#909090' : '#777';
        this.context.fillRect(xy[0], xy[1], this.scale, this.scale);
        this.context.strokeRect(xy[0], xy[1], this.scale, this.scale);

        if (tile.isRevealed && tile.score > 0 && !tile.hasMine) {
            this.Write(tile.score.toString(), p);
        }
        else if (tile.isRevealed && tile.hasMine) {
            this.Write("X", p);
        }
        else if (tile.hasFlag) {
            this.Write("^", p);
        }
    }

    public DrawPoints(room: Room, points: Point[]) {
        points.forEach(p => {
            this.Draw(room, p);
        });
    }
}
