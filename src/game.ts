import { Point } from "./data";
import { Renderer } from "./renderer";
import { Room } from "./room";

export class Game {
    constructor (
        private renderer: Renderer
    ) {
        this.playing = false;
        this.initialized = false;

    }

    // @ts-ignore 'playing' is declared but its value is never read
    private playing: boolean;
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

        const size = 15;
        this.currentRoom = new Room(size, size);
        this.renderer.DrawRoom(this.currentRoom);

        this.initialized = true;
    }

    Debug(message: string) {
        console.log(message);
    }

    HandleReturn() {
        this.Debug("Return pressed");
    }

    OpenMenu(menuName: string) {
        if (menuName == "main") {
            this.renderer.Write("Dungeon Sweeper", Point.Make(10, 1));
            this.renderer.Write("Use your minesweeping skills to find your way out of captivity and search for the legendary treasure.", Point.Make(1, 2));
            this.renderer.Write("Press Enter to play.", Point.Make(5, 3))
        }
    }

    Start() {
        this.playing = true;
        if (this.currentRoom) {
            this.currentRoom.Initialize(Math.floor(this.currentRoom.height * this.currentRoom.width / 5));
            this.renderer.DrawRoom(this.currentRoom);
        }
    }
}
