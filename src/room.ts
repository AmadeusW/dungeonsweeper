import { Point } from "./data";

export class Room {
    constructor(
        public width: number,
        public height: number,
    ) {

    }

    private mines: Point[];
    //private numbers: number[];

    public Initialize(mineCount: number) {
        this.mines = this.InitializeMines(mineCount);
        //this.numbers = this.InitializeNumbers(this.mines);
    }

    public HasMine(location: Point) {

    }

    public GetNumber(location: Point) {

    }

    private IndexFromPoint(location: Point) {
        return location.y * this.width + location.x;
    }

    private PointFromIndex(index: number) {
        let row = Math.floor(index / this.width);
        let rowStart = row * this.width;
        let column = index - rowStart;
        return Point.Make(row, column);
    }

    private InitializeMines(mineCount: number) {
        let mineList = new Point[mineCount];
        for (var i = 0; i < mineCount; i++) {
            let newMine = this.makeNewMine(mineList);
            mineList[i] = newMine;
        }
        return mineList;
    }

    private makeNewMine(existingMines: Point[]) {
        var proposedX = this.getRandomInt(this.width);
        var proposedY = this.getRandomInt(this.height);
        var proposedPoint = Point.Make(proposedX, proposedY);
        if (existingMines.find(n => n == proposedPoint)) {
            return this.makeNewMine(existingMines);
        } else {
            return proposedPoint;
        }
    }

    private getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    //private InitializeNumbers(mines: Point[]) {
        // return number[]
    //}
}