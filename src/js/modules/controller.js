export default class Controller {
  constructor(game, view, sound) {
    this.game = game;
    this.view = view;
    this.sound = sound;

    this.intervalId = null;
    this.isPlaying = false;


    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.buttons = document.getElementsByTagName('button');
    document.addEventListener('click', this.handleClick.bind(this));

    this.view.renderStartScreen();
  }

  update() {
    this.game.movePieceDown();
    this.updateView();
  }

  updateView() {
    const state = this.game.getState();
    if (state.isGameOver) {
      this.game.handleMusic(false);
      this.view.renderEndScreen(state);
    } else if (!this.isPlaying) {
      this.game.handleMusic(false);
      this.view.renderPauseScreen();
    } else {
      this.view.renderMainScreen(state);
      this.game.playMusic(state.isMusicOn);
    }
  }

  play() {
    this.isPlaying = true;
    this.startTimer();
    this.updateView();
  }


  pause() {
    this.isPlaying = false;
    this.game.playSoundIndepended('pause');
    this.stopTimer();
    this.updateView();
  }

  reset() {
    this.game.reset();
    this.play();
  }

  startTimer() {
    const speed = 1000 - this.game.getState().level * 100;

    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.update();
      }, speed > 0 ? speed : 100);
    }
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  handleKeyDown({
    keyCode
  }) {
    const state = this.game.getState();

    switch (keyCode) {
      case 13: // Enter
        if (state.isGameOver) {
          this.reset();
        } else if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
        break;
      case 37: // left arrow
        if (this.isPlaying) {
          this.game.movePieceLeft();
          this.updateView();
        }
        break;
      case 38: // up arrow
        if (this.isPlaying) {
          this.game.rotatePiece();
          this.updateView();
        }
        break;
      case 39: // right arrow
        if (this.isPlaying) {
          this.game.movePieceRight();
          this.updateView();
        }
        break;
      case 40: // down arrow
        if (this.isPlaying) {
          this.stopTimer();
          this.game.movePieceDown();
          this.updateView();
        }
        break;
    }
  }

  handleKeyUp({
    keyCode
  }) {
    switch (keyCode) {
      case 40: // down arrow
        if (this.isPlaying) {
          this.startTimer();
        }
        break;
    }
  }

  handleClick({
    target
  }) {
    const state = this.game.getState();
    const {
      isSoundOn,
      isMusicOn
    } = this.sound.getSoundState();
    const keyId = target.getAttribute('id');

    switch (keyId) {
      case 'keyStart':
        if (state.isGameOver) {
          this.reset();
        } else if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
        break;
      case 'keyMusic':
        if (isMusicOn) {
          localStorage.setItem('isMusicOn', false);
        } else {
          localStorage.setItem('isMusicOn', true);
        }
        this.sound.getSoundState();
        break;
      case 'keySound':
        if (isSoundOn) {
          localStorage.setItem('isSoundOn', false);
        } else {
          localStorage.setItem('isSoundOn', true);
        }
        this.sound.getSoundState();
        break;
      case 'keyLeft':
        if (this.isPlaying) {
          this.game.movePieceLeft();
          this.updateView();
        }
        break;
      case 'keyUp':
        if (this.isPlaying) {
          this.game.rotatePiece();
          this.updateView();
        }
        break;
      case 'keyRotate':
        if (this.isPlaying) {
          this.game.rotatePiece();
          this.updateView();
        }
        break;
      case 'keyRight': // right arrow
        if (this.isPlaying) {
          this.game.movePieceRight();
          this.updateView();
        }
        break;
      case 'keyDown': // down arrow
        if (this.isPlaying) {
          this.game.movePieceDown();
          this.updateView();
        }
        break;
    }
  }
}