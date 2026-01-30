import Game from './model/Game.js';
import GameView from './view/GameView.js';
import GameController from './controller/GameController.js';

//MODEL
const game = new Game();

//VIEW
const gameView = new GameView(game);

//CONTROLLER
console.log(game, gameView);
const gameController = new GameController(game, gameView);
