export class Point {
    constructor(
        public x: number, 
        public y: number,
        public levelx?: number, 
        public levely?: number) { }

    public static Make(x: number, y: number) {
        return new Point(x, y, 1, 1);
    }

    public ToString() {
        return `(${this.x}, ${this.y})`;
    }
}

export enum Interaction {
    Enter,
    Flag,
    Reveal,
}
