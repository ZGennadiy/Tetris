import Game from './modules/game.js';
import View from './modules/view.js';

const root = document.getElementById('root');
const options = {
  width: 320,
  height: 640,
  rows: 20,
  colums: 10,
};

const game = new Game();
const view = new View(root, options);


window.game = game;
window.view = view;

document.addEventListener('keydown', ({
  keyCode
}) => {
  switch (keyCode) {
    case 37: // left arrow
      game.movePieceLeft();
      view.render(game.getState());
      break;
    case 38: // up arrow
      game.rotatePiece();
      view.render(game.getState());
      break;
    case 39: // right arrow
      game.movePieceRight();
      view.render(game.getState());
      break;
    case 40: // down arrow
      game.movePieceDown();
      view.render(game.getState());
      break;
  }
});