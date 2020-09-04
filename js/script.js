import Game from './modules/game.js';
import View from './modules/view.js';
import Controller from './modules/controller.js';
import Sound from './modules/sound.js';
var root = document.getElementById('root');
var options = {
  width: 240,
  height: 320,
  rows: 20,
  colums: 10
};
var sound = new Sound(root);
var game = new Game(sound);
var view = new View(root, options);
var controller = new Controller(game, view, sound);
window.game = game;
window.view = view;
window.controller = controller;
window.sound = sound;