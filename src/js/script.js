import Game from './modules/game.js';
import View from './modules/view.js';
import Controller from './modules/controller.js';

const root = document.getElementById('root');
const options = {
  width: 240,
  height: 320,
  rows: 20,
  colums: 10,
};

const game = new Game();
const view = new View(root, options);
const controller = new Controller(game, view);


window.game = game;
window.view = view;
window.controller = controller;