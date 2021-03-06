import { Point, Interaction } from "./data";
import { Renderer } from "./renderer";
import { Room } from "./room";

export class Game {
    constructor (
        private renderer: Renderer
    ) {
        this.initialized = false;
        this.renderer.GameCallback = this;
    }

    private initialized: boolean;
    private currentRoom?: Room;
    
    Initialize() {
        if (this.initialized) {
            return;
        }
        
        let game = this;
        document.onkeydown = function(e) {
            var code = e.keyCode;
            game.Debug("Keydown: " + code);
            if (code == 13) {
                game.HandleReturn();
            }
        };

        this.Start();
        this.initialized = true;
    }

    Debug(message: string) {
        console.log(message);
    }

    HandleReturn() {
        this.Debug("Return pressed");
    }

    public OnPointInteraction(p: Point, kind: Interaction) {
        switch (kind) {
            case Interaction.Enter:
                this.EnterTile(p);
                return;
            case Interaction.Flag:
                this.FlagTile(p);
                return;
            case Interaction.Reveal:
                this.RevealNeighbors(p);
                return;
        }
    }

    public EnterTile(p: Point) {
        if (!this.currentRoom)
            return;

        if (!this.currentRoom.IsInitialized)
            this.currentRoom.Initialize(p);

        let redrawList = new Array();
        this.currentRoom.RevealTile(p, redrawList);
        this.renderer.DrawPoints(this.currentRoom, redrawList);
    }

    public FlagTile(p: Point) {
        if (!this.currentRoom)
            return;

        if (!this.currentRoom.IsInitialized)
            this.currentRoom.Initialize(p);

        let redrawList = new Array();
        this.currentRoom.FlagTile(p, redrawList);
        this.renderer.DrawPoints(this.currentRoom, redrawList);
    }

    public RevealNeighbors(p: Point) {
        if (!this.currentRoom)
            return;

        if (!this.currentRoom.IsInitialized)
            return;

        let redrawList = new Array();
        // Reveak only if it appears that all known mines are accounted for
        this.currentRoom.RevealNeighbors(p, redrawList);
        this.renderer.DrawPoints(this.currentRoom, redrawList);
    }

    public GameOver() {
        this.initialized = false;
    }

    OpenMenu(menuName: string) {
        if (menuName == "main") {
            this.renderer.Write("Dungeon Sweeper", Point.Make(10, 1));
            this.renderer.Write("Use your minesweeping skills to find your way out of captivity and search for the legendary treasure.", Point.Make(1, 2));
            this.renderer.Write("Press Enter to play.", Point.Make(5, 3))
        }
    }

    Start() {
        const size = 15;
        let mineCount = Math.floor(size * size / 6);
        this.currentRoom = new Room(size, size, mineCount, this);
        this.renderer.currentRoom = this.currentRoom;
        this.renderer.DrawRoom(this.currentRoom);
    }
}
