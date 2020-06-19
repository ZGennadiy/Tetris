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
      this.view.renderEndScreen(state);
    } else if (!this.isPlaying) {
      this.view.renderPauseScreen();
    } else {
      this.view.renderMainScreen(state);
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
    this.game.playMusic(this.game.getState().isMusicOn);
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
    const {
      isSoundOn,
      isMusicOn,
      isGameOver
    } = this.game.getState();

    switch (keyCode) {
      case 80: // Key P
        if (isGameOver) {
          this.reset();
          this.game.playMusic(isMusicOn);
        } else if (this.isPlaying) {
          this.game.pauseMusic(isMusicOn);
          this.pause();
        } else {
          this.game.playMusic(isMusicOn);
          this.play();
        }
        break;
      case 77: // Key M
        if (this.isPlaying && isMusicOn) {
          localStorage.setItem('isMusicOn', false);
          this.game.pauseMusic();
        } else if (this.isPlaying) {
          localStorage.setItem('isMusicOn', true);
          this.game.playMusic();
        }
        break;
      case 83: // Key S
        if (this.isPlaying && isSoundOn) {
          localStorage.setItem('isSoundOn', false);
        } else if (this.isPlaying) {
          localStorage.setItem('isSoundOn', true);
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
    const {
      isSoundOn,
      isMusicOn,
      isGameOver
    } = this.game.getState();
    const keyId = target.getAttribute('id');

    switch (keyId) {
      case 'keyStart':
        if (isGameOver) {
          this.game.playMusic(isMusicOn);
          this.reset();
        } else if (this.isPlaying) {
          this.game.pauseMusic(isMusicOn);
          this.pause();
        } else {
          this.game.playMusic(isMusicOn);
          this.play();
        }
        break;
      case 'keyMusic':
        if (this.isPlaying && isMusicOn) {
          localStorage.setItem('isMusicOn', false);
          this.game.pauseMusic();
        } else if (this.isPlaying) {
          localStorage.setItem('isMusicOn', true);
          this.game.playMusic();
        }
        break;
      case 'keySound':
        if (this.isPlaying && isSoundOn) {
          localStorage.setItem('isSoundOn', false);
        } else if (this.isPlaying) {
          localStorage.setItem('isSoundOn', true);
        }
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