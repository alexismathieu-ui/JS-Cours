// Exemple de message recu par le backend, à utiliser pour vos tests :
const backendData = {
  isRunning: true,
  isOver: false,
  timer: 190.6000000000091,
  players: {
    "3cd71bbb-6a6b-4d4e-80e3-107130328a27": {
      name: "blabla",
      skinPath: "./assets/3.png",
      position: [0.5600000000000003, 0.17999999999999977],
      lvl: 1,
      hp: 100,
      maxHp: 100,
      hpRegenRate: 10,
      speed: 0.2,
      direction: 3,
      isAttacking: false,
      isWalking: false,
      isDying: false,
      attackCooldown: 1,
      currentAttackCooldown: 0,
    },
    "28ead291-fcea-4b41-a596-d3c876c49a53": {
      name: "bloublou",
      skinPath: "./assets/4.png",
      position: [0.44, 0.19],
      lvl: 1,
      hp: 100,
      maxHp: 100,
      hpRegenRate: 10,
      speed: 0.2,
      direction: 0,
      isAttacking: false,
      isWalking: false,
      isDying: false,
      attackCooldown: 1,
      currentAttackCooldown: 0,
    },
  },
};
console.log(backendData);

class Game {
  constructor() {
    this.isRunning = false;
    this.isOver = false;
    this.timer = 0;
    this.players = {};
  }
  update(gameStateFromServer) {
    // Update game metadata
    this.isRunning = gameStateFromServer.isRunning;
    this.isOver = gameStateFromServer.isOver;
    this.timer = gameStateFromServer.timer;
    //Update players
    const serverPlayerIds = new Set(Object.keys(gameStateFromServer.players));
    // Add or update players from server data
    for (const playerId of serverPlayerIds) {
      const playerData = gameStateFromServer.players[playerId];
      if (this.players[playerId]) {
        // Player exists, update it
        this.players[playerId].update(playerData);
      } else {
        // New player, create and add it
        this.players[playerId] = new Player(
          playerId,
          playerData.name,
          playerData.skinPath,
          playerData.position
        );
      }
    }

    //Remove players not present in server data
    for (const playerId of Object.keys(this.players)) {
      if (!serverPlayerIds.has(playerId)) {
        delete this.players[playerId];
      }
    }
  }
}

// Example test code
const game = new Game();
console.log("Initial game state:", game);
game.update(backendData);

// Simulate a player leaving and a new player joining
const modifiedBackendData = JSON.parse(JSON.stringify(backendData));
console.log(
  "Le Joueur",
  modifiedBackendData.players["3cd71bbb-6a6b-4d4e-80e3-107130328a27"].name,
  "a quitter la partie"
);
delete modifiedBackendData.players["3cd71bbb-6a6b-4d4e-80e3-107130328a27"];
modifiedBackendData.players["new-player-id"] = {
  name: "Fabrice",
  skinPath: "./assets/8.png",
  position: [0.788555452214, 0.185663324],
  lvl: 1,
  hp: 100,
  maxHp: 100,
  hpRegenRate: 10,
  speed: 0.2,
  direction: 1,
  isAttacking: false,
  isWalking: false,
  isDying: false,
  attackCooldown: 1,
  currentAttackCooldown: 0,
};
console.log(
  "Le Joueur",
  modifiedBackendData.players["new-player-id"].name,
  "A rejoint la partie"
);
game.update(modifiedBackendData);
