var ctx;
var scale = 20;

var Game = { 
    playing: false,
    initialized: false,
    PositionToPx: function(p) {
        return p * scale;
    },
    Write: function(text, x, y, fg) {
        ctx.fillText(text, x*scale, y*scale);
    },
    Initialize: function() {
        if (this.initialized) {
            return;
        }
        
        this.Write("@", 5,  4);
        this.Write(15, 4, "%", "#0f0");          // foreground color
        this.Write(25, 4, "#", "#f00", "#009");  // and background color
        
        document.onkeydown = function(e) {
            var code = e.keyCode;
            Game.Debug("Keydown: " + code);
            if (code == 13) {
                Game.HandleReturn();
            }
        };

        this.intiailized = true;
    }, // this.init
    HandleReturn: function() {
        this.Start();
    },
    Debug: function(message) {
        document.getElementById("debug").innerHTML = message;
    },
    RenderMenu: function(menu) {
        if (menu == "main") {
            this.Write("Dungeon Sweeper", 5,  1);
            this.Write("Use your minesweeping skills to find your way out of captivity and search for the legendary treasure.", 1, 2);
            this.Write("Press Enter to play.", 1, 3)
        }
        else
        {
            Game.Debug("Invalid parameter: " + menu)
        }
    },
    Render: function() {
        ctx.fillRect(25, 25, 100, 100);
        ctx.clearRect(45, 45, 60, 60);
        ctx.strokeRect(50, 50, 50, 50);
        this.Write("@", 50,  4);
        this.Write(15, 4, "%", "#0f0");          /* foreground color */
        this.Write(25, 4, "#", "#f00", "#009");  /* and background color */
    },
    Start: function() {
        this.playing = true;
        this.Render();
    }
}
