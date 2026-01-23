/*
Partie 4 – Interpolation des déplacements :
Le serveur envoie des mises à jour 20 fois par seconde, tandis que le navigateur affiche environ 60 images par seconde.
Sans interpolation, les mouvements paraissent saccadés. Vous lisserez les mouvements des personnages dans votre rendu pour réparer cette infâmie, qui paraît sûrement tout à fait normale à des gens comme Maxime.
Dans la classe Player, ajoutez :
●	Des propriétés de position précédente (écrasées par les positions actuelles avant que ces dernières ne soient elles-même remplacées par de nouvelles données dans la méthode update).
●	Des propriétés de position de rendu (la position à laquelle le joueur est réellement affiché suite à l’interpolation, en opposition à la position précédente et à la nouvelle position).
●	Une méthode interpolate(alpha), appelée à chaque frame, qui calcule les positions de rendu grâce au calcul d’interpolation.
Le paramètre alpha représente la progression entre deux ticks serveur (0 → 1). Il sera calculé grâce au paramètre timestamp de la méthode loop de la classe GameController. 
Le plus simple reste de calculer alpha dans la boucle du GameController.
*/

class GameController {
    constructor() {
      
        // Server sends updates at 20 ticks per second
        this.SERVER_TICK_RATE = 20;
        // Duration between two server ticks in milliseconds
        this.SERVER_INTERVAL = 1000 / this.SERVER_TICK_RATE;

        this.lastGameState = null;
        this.lastServerUpdate = performance.now();
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
        // Create an attribute containing an instance of the GameView class
        this.gameView = new GameView(this.game);

    }

    //  Main render loop 
    loop(timestamp) {
        // interpolate all players
        const alpha = Math.min((timestamp - this.lastServerUpdate) / this.SERVER_INTERVAL, 1);


        for (const id in this.game.players){
            this.game.players[id].interpolate(alpha);
        }
        // Render the game view
        this.gameView.render();

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
            this.lastGameState = gameStateFromServer; // données
            this.lastServerUpdate = performance.now(); // temps
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


