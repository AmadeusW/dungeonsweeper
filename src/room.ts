import { Point } from "./data";

export class Tile {
    constructor(){
        this.hasMine = false;
        this.score = 0;
        this.hasTreasure = false;
        this.isRevealed = false;
    }
    // TODO: consolidate
    public hasMine: boolean;
    public score: number;
    public hasTreasure: boolean;
    public isRevealed: boolean;
}

export class Room {
    constructor(
        public width: number,
        public height: number,
    ) {
        this.maxIndex = width*height;
        this.tiles = new Array(this.maxIndex);
        for (var i = 0; i < this.maxIndex; i++) {
            this.tiles[i] = new Tile();
        }
        this.minesInitialized = false;
    }
    private tiles: Tile[];
    private maxIndex: number;
    private minesInitialized: boolean;

    public Initialize(mineCount: number) {
        this.InitializeMines(mineCount);
        this.InitializeNumbers();
    }

    public TileAt(location: Point) {
        const i = location.y * this.width + location.x;
        return this.tiles[i];
    }
/*
    private PointFromIndex(index: number) {
        let row = Math.floor(index / this.width);
        let rowStart = row * this.width;
        let column = index - rowStart;
        return Point.Make(row, column);
    }
*/
    private InitializeMines(mineCount: number) {
        if (mineCount >= this.maxIndex) {
            throw "mineCount is too large. Should be less than number of tiles."
        }
        if (this.minesInitialized) {
            return;
        }
        let count = 0;
        while (count < mineCount) {
            let candidate = this.getRandomInt(this.maxIndex);
            let tile = this.tiles[candidate];
            if (tile.hasMine) {
                continue;
            }
            tile.hasMine = true;
            count++;
        }
        this.minesInitialized = true;
    }

    private InitializeNumbers() {
        for (let i = 0; i < this.maxIndex; i++) {
            this.tiles[i].score = 1;
        }
    }

    private getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}