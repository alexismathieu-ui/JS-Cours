class GameController {
    constructor() {
      
        // Server sends updates at 20 ticks per second
        this.SERVER_TICK_RATE = 20;
        // Duration between two server ticks in milliseconds
        this.SERVER_INTERVAL = 1000 / this.SERVER_TICK_RATE;

        this.lastGameState = null;
        // Permanently bind "this" at the instance of the GameController class
        this.loop = this.loop.bind(this);

        // Regulates framerate to keep 60fps
        requestAnimationFrame(this.loop);

        // Create an attribute containing an instance of the Game class
        this.game = new Game();

        // Create attributes to store values from localStorage
        this.playerName = localStorage.getItem('pseudo');
        this.serverUrl = localStorage.getItem('backend');
        this.spritePath = localStorage.getItem('skinPath');

        // Create an attribute to manage keyboard events
        this.keyStates = {
            up: false,
            down: false,
            left: false,
            right: false,
            attack: false
        }

           if (!this.playerName || !this.spritePath) {
            console.error("Pseudo ou skin manquant");
            return;
        }

        // === WebSocket ===
        this.socket = new WebSocket(this.serverUrl);
        this.initSocket();
        this.initInput();
        this.startInputSender();

    }

    //  Main render loop 
    loop(timestamp) {

        // Request the next frame
        requestAnimationFrame(this.loop);
    }
    // Initialize WebSocket connection 
    initSocket() {
        this.socket.onopen = () => {
            console.log("Connection open");

            const registrationMessage = {
                name: this.playerName,
                skinPath: this.spritePath
            };

            this.socket.send(JSON.stringify(registrationMessage));
        };

        this.socket.onmessage = (event) => {
            const gameStateFromServer = JSON.parse(event.data);
            this.lastGameState = gameStateFromServer;
            this.game.update(gameStateFromServer);
        };

        this.socket.onerror = (e) => {
            console.error("WebSocket error", e);
        };

        this.socket.onclose = () => {
            console.log("WebSocket closed");
        };
    }
    // Initialize keyboard input handling
    initInput() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'z':
                    this.keyStates.up = true;
                    break;
                case 's':
                    this.keyStates.down = true;
                    break;
                case 'q':
                    this.keyStates.left = true;
                    break;
                case 'd':
                    this.keyStates.right = true;
                    break;
                case ' ':
                    this.keyStates.attack = true;
                    break;
            }
            console.log(this.keyStates);
        })
        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'z':
                    this.keyStates.up = false;
                    break;
                case 's':
                    this.keyStates.down = false;
                    break;
                case 'q':
                    this.keyStates.left = false;
                    break;
                case 'd':
                    this.keyStates.right = false;
                    break;
                case ' ':
                    this.keyStates.attack = false;
                    break;
            }
            console.log(this.keyStates);
        });
    }
    startInputSender() {
        setInterval(() => {
            if (this.socket.readyState !== WebSocket.OPEN){
                return;
            }
            const inputMessage = {
                type: "input",
                input: this.keyStates
            };
            this.socket.send(JSON.stringify(inputMessage));
        }, this.SERVER_INTERVAL);
    }
}

// === Start the game controller by instantiating the GameController class ===
// This line will execute the constructor (e.g, launch the frontend)

new GameController();

