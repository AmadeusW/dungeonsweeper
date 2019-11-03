import { Point } from "./data";
import { Renderer } from "./renderer";

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
        let p = Point.Make(3, 3);
        this.renderer.Write("hi", p);
    }
}
