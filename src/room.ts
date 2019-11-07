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
        public mineCount: number,
    ) {
        this.maxIndex = width*height;
        if (this.mineCount >= this.maxIndex) {
            throw "mineCount is too large. Should be less than number of tiles."
        }
        this.mineCount = mineCount;
        this.tiles = new Array(this.maxIndex);
        for (var i = 0; i < this.maxIndex; i++) {
            this.tiles[i] = new Tile();
        }
        this.minesInitialized = false;
        this.IsInitialized = false;
    }
    private tiles: Tile[];
    private maxIndex: number;
    private minesInitialized: boolean;
    public IsInitialized: boolean;

    public Initialize() {
        this.InitializeMines();
        this.InitializeNumbers();
        this.IsInitialized = true;
    }

    public TileAt(location: Point) {
        const i = location.y * this.width + location.x;
        return this.tiles[i];
    }

    private PointFromIndex(index: number) {
        let row = Math.floor(index / this.width);
        let rowStart = row * this.width;
        let column = index - rowStart;
        console.log(`Point from index ${index}: row ${row} starts at ${rowStart} column ${column}`);
        return Point.Make(column, row);
    }

    private InitializeMines() {
        if (this.minesInitialized) {
            return;
        }
        let count = 0;
        while (count < this.mineCount) {
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
            const point = this.PointFromIndex(i);
            let nearMines = 0;
            console.log(`Initializing tile ${i} or ${point.x},${point.y}`);
            // To the sides
            if (point.x > 0)
                nearMines += this.tiles[i - 1].hasMine ? 1 : 0;
            if (point.x < this.width - 1)
                nearMines += this.tiles[i + 1].hasMine ? 1 : 0;

            // Above
            if (point.y > 0) {
                nearMines += this.tiles[i - this.width].hasMine ? 1 : 0;
                if (point.x > 0)
                    nearMines += this.tiles[i - this.width - 1].hasMine ? 1 : 0;
                if (point.x < this.width - 1)
                    nearMines += this.tiles[i - this.width + 1].hasMine ? 1 : 0;
            }

            // Below
            if (point.y < this.height - 1) {
                nearMines += this.tiles[i + this.width].hasMine ? 1 : 0;
                if (point.x > 0)
                    nearMines += this.tiles[i + this.width - 1].hasMine ? 1 : 0;
                if (point.x < this.width - 1)
                    nearMines += this.tiles[i + this.width + 1].hasMine ? 1 : 0;
            }
            
            this.tiles[i].score = nearMines;
        }
    }

    private getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}