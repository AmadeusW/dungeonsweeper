import { Point } from "./data";
import { Game } from "./game";

export class Tile {
    constructor(){
        this.hasMine = false;
        this.hasFlag = false;
        this.score = 0;
        this.hasTreasure = false;
        this.isRevealed = false;
    }
    public hasMine: boolean;
    public hasFlag: boolean;
    public score: number;
    public hasTreasure: boolean;
    public isRevealed: boolean;
}

export class Room {
    constructor(
        public width: number,
        public height: number,
        public mineCount: number,
        private gameCallback: Game,
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

    public Initialize(safePoint: Point) {
        this.InitializeMines(safePoint);
        this.InitializeNumbers();
        this.IsInitialized = true;
    }

    public TileAt(location: Point) {
        const i = location.y * this.width + location.x;
        return this.tiles[i];
    }

    public IndexAt(location: Point) {
        return location.y * this.width + location.x;
    }

    public RevealTile(point: Point, redrawList: Point[]) {
        let clickedTile = this.TileAt(point);
        if (clickedTile.isRevealed || clickedTile.hasFlag)
            return;

        clickedTile.isRevealed = true;
        redrawList.push(point);
        if (clickedTile.hasMine) {
            this.gameCallback.GameOver();
        }
        // Reveal neighboring tiles
        else if (clickedTile.score == 0) {
            this.RevealNeighbors(point, redrawList);
        }
        return redrawList;
    }

    public FlagTile(point: Point, redrawList: Point[]) {
        let clickedTile = this.TileAt(point);
        if (clickedTile.isRevealed)
            return;

        clickedTile.hasFlag = !clickedTile.hasFlag;
        redrawList.push(point);
        return redrawList;
    }

    public RevealNeighbors(point: Point, redrawList: Point[]) {
        // First, determine eligibility
        const thisTile = this.TileAt(point);
        if (!thisTile.isRevealed) {
            return;
        }
        const targetFlagCount = thisTile.score;
        if (targetFlagCount > 0) {
            let flagCount = 0;
            // To the sides
            if (point.x > 0)
                flagCount += this.TileAt(Point.Make(point.x - 1, point.y)).hasFlag ? 1 : 0;
            if (point.x < this.width - 1)
                flagCount += this.TileAt(Point.Make(point.x + 1, point.y)).hasFlag ? 1 : 0;

            // Above
            if (point.y > 0) {
                flagCount += this.TileAt(Point.Make(point.x, point.y - 1)).hasFlag ? 1 : 0;
                if (point.x > 0)
                    flagCount += this.TileAt(Point.Make(point.x - 1, point.y - 1)).hasFlag ? 1 : 0;
                if (point.x < this.width - 1)
                    flagCount += this.TileAt(Point.Make(point.x + 1, point.y - 1)).hasFlag ? 1 : 0;
            }

            // Below
            if (point.y < this.height - 1) {
                flagCount += this.TileAt(Point.Make(point.x, point.y + 1)).hasFlag ? 1 : 0;
                if (point.x > 0)
                    flagCount += this.TileAt(Point.Make(point.x - 1, point.y + 1)).hasFlag ? 1 : 0;
                if (point.x < this.width - 1)
                    flagCount += this.TileAt(Point.Make(point.x + 1, point.y + 1)).hasFlag ? 1 : 0;
            }

            if (targetFlagCount > flagCount) {
                return;
            }
        }

        // Then, reveal neighbors
        // To the sides
        if (point.x > 0)
            this.RevealTile(Point.Make(point.x - 1, point.y), redrawList);
        if (point.x < this.width - 1)
            this.RevealTile(Point.Make(point.x + 1, point.y), redrawList);

        // Above
        if (point.y > 0) {
            this.RevealTile(Point.Make(point.x, point.y - 1), redrawList);
            if (point.x > 0)
                this.RevealTile(Point.Make(point.x - 1, point.y - 1), redrawList);
            if (point.x < this.width - 1)
                this.RevealTile(Point.Make(point.x + 1, point.y - 1), redrawList);
        }

        // Below
        if (point.y < this.height - 1) {
            this.RevealTile(Point.Make(point.x, point.y + 1), redrawList);
            if (point.x > 0)
                this.RevealTile(Point.Make(point.x - 1, point.y + 1), redrawList);
            if (point.x < this.width - 1)
                this.RevealTile(Point.Make(point.x + 1, point.y + 1), redrawList);
        }
    }

    private PointFromIndex(index: number) {
        let row = Math.floor(index / this.width);
        let rowStart = row * this.width;
        let column = index - rowStart;
        console.log(`Point from index ${index}: row ${row} starts at ${rowStart} column ${column}`);
        return Point.Make(column, row);
    }

    private InitializeMines(safePoint: Point) {
        if (this.minesInitialized) {
            return;
        }
        let safeIndex = this.IndexAt(safePoint); 
        let count = 0;
        while (count < this.mineCount) {
            let candidate = this.getRandomInt(this.maxIndex);
            let tile = this.tiles[candidate];
            if (tile.hasMine || candidate == safeIndex) {
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