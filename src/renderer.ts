import { Point } from "./data";

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

    public Write (text: string, p: Point) {
        let s = this.PointToScreen(p);
        this.ctx.fillText(text, s[0], s[1]);
    }
}
