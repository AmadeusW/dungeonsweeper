var ctx;

var Game = { 
    playing: false,
    initialized: false,
    Initialize: function() {
        if (this.initialized) {
            return;
        }
        
        ctx.fillText("@", 5,  4);
        ctx.fillText(15, 4, "%", "#0f0");          // foreground color
        ctx.fillText(25, 4, "#", "#f00", "#009");  // and background color
        
        document.onkeydown = function(e) {
            var code = e.keyCode;
            if (code == 13) {
                Game.HandleReturn();
            }

            var vk = "?"; /* find the corresponding constant */
            for (var name in ROT.KEYS) {
                if (ROT.KEYS[name] == code && name.indexOf("VK_") == 0) { vk = name; }
            }
            Game.Debug("Keydown: code is " + code + " (" + vk + ")");
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
            ctx.fillText("Dungeon Sweeper", 5,  2);
            ctx.fillText("Escape the dungeons riddled with mines. Use your minesweeping skills to find your way out of captivity and search for the legendary treasure.", 13, 40);
            ctx.fillText("Press Enter to play.", 5, 80)
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
        ctx.fillText("@", 50,  4);
        ctx.fillText(15, 4, "%", "#0f0");          /* foreground color */
        ctx.fillText(25, 4, "#", "#f00", "#009");  /* and background color */
    },
    Start: function() {
        playing = true;
        this.Render();
    }
}
