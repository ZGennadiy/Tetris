export default class Game {
  static points = {
    '1': 40,
    '2': 100,
    '3': 300,
    '4': 1200,
  };

  constructor(sound) {
    this.sound = sound;
    this.reset();
  }


  get level() {
    return Math.floor(this.lines * 0.1);
  }

  getState() {
    const playfield = this.createPlayfield();
    const {
      y: pieceY,
      x: pieceX,
      blocks
    } = this.activePiece;

    for (let y = 0; y < this.playfield.length; y += 1) {
      playfield[y] = [];

      for (let x = 0; x < this.playfield[y].length; x += 1) {
        playfield[y][x] = this.playfield[y][x];
      }
    }

    for (let y = 0; y < blocks.length; y += 1) {
      for (let x = 0; x < blocks[y].length; x += 1) {
        if (blocks[y][x]) {
          playfield[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }

    return {
      level: this.level,
      lines: this.lines,
      score: this.score,
      hiscore: this.hiscore,
      nextPiece: this.nextPiece,
      playfield,
      isGameOver: this.topOut,
      isSoundOn: this.sound.getSoundState().isSoundOn,
      isMusicOn: this.sound.getSoundState().isMusicOn,
    };
  }

  reset() {
    this.score = 0;
    this.hiscore = localStorage.getItem('hiscore') || 0;
    this.lines = 0;
    this.topOut = false;
    this.playfield = this.createPlayfield();
    this.activePiece = this.createPiece();
    this.nextPiece = this.createPiece();
  }

  createPlayfield(emptyBlock = 0) {
    const playfield = [];

    for (let y = 0; y < 20; y += 1) {
      playfield[y] = [];

      for (let x = 0; x < 10; x += 1) {
        playfield[y][x] = emptyBlock;
      }
    }

    return playfield;
  }

  createPiece() {
    const index = Math.floor(Math.random() * 7);
    const types = 'IJLOSTZ';
    const type = types[index];
    const piece = {};

    switch (type) {
      case 'I':
        piece.blocks = [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        break;
      case 'J':
        piece.blocks = [
          [0, 0, 0],
          [2, 2, 2],
          [0, 0, 2],
        ];
        break;
      case 'L':
        piece.blocks = [
          [0, 0, 0],
          [3, 3, 3],
          [3, 0, 0],
        ];
        break;
      case 'O':
        piece.blocks = [
          [0, 0, 0, 0],
          [0, 4, 4, 0],
          [0, 4, 4, 0],
          [0, 0, 0, 0]
        ];
        break;
      case 'S':
        piece.blocks = [
          [0, 0, 0],
          [0, 5, 5],
          [5, 5, 0],
        ];
        break;
      case 'T':
        piece.blocks = [
          [0, 0, 0],
          [6, 6, 6],
          [0, 6, 0],
        ];
        break;
      case 'Z':
        piece.blocks = [
          [0, 0, 0],
          [7, 7, 0],
          [0, 7, 7],
        ];
        break;
      default:
        throw new Error(`Unknown type of piece: ${type}`);
    }

    piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
    piece.y = -1;

    return piece;
  }


  movePieceLeft() {
    this.activePiece.x -= 1;
    if (this.hasCollision()) {
      this.activePiece.x += 1;
    } else {
      this.playSound('whoosh');
    }
  }

  movePieceRight() {
    this.activePiece.x += 1;
    if (this.hasCollision()) {
      this.activePiece.x -= 1;
    } else {
      this.playSound('whoosh');
    }
  }

  movePieceDown() {
    if (this.topOut) {
      return;
    }

    this.activePiece.y += 1;
    if (this.hasCollision()) {
      this.activePiece.y -= 1;
      this.lockPiece();
      const numOfClearedLines = this.clearLines();
      this.updateScore(numOfClearedLines);
      this.updatePieces();
    }

    if (this.hasCollision()) {
      this.topOut = true;
      this.pauseMusic();
      this.playSoundEndGame(this.getState());
    }
  }

  rotatePiece() {
    this.rotateBlocks();
    if (this.hasCollision()) {
      this.rotateBlocks(false);
    }
  }

  rotateBlocks(clockwise = true) {
    const blocks = this.activePiece.blocks;
    const length = blocks.length;
    const x = Math.floor(length / 2);
    const y = length - 1;

    for (let i = 0; i < x; i += 1) {
      for (let j = i; j < y - i; j += 1) {
        const temp = blocks[i][j];

        if (clockwise) {
          blocks[i][j] = blocks[y - j][i];
          blocks[y - j][i] = blocks[y - i][y - j];
          blocks[y - i][y - j] = blocks[j][y - i];
          blocks[j][y - i] = temp;
        } else {
          blocks[i][j] = blocks[j][y - i];
          blocks[j][y - i] = blocks[y - i][y - j];
          blocks[y - i][y - j] = blocks[y - j][i];
          blocks[y - j][i] = temp;
        }
      }
    }
    if (clockwise) {
      this.playSound('blockRotate');
    }
  }

  hasCollision() {
    const {
      y: pieceY,
      x: pieceX,
      blocks
    } = this.activePiece;

    for (let y = 0; y < blocks.length; y += 1) {
      for (let x = 0; x < blocks[y].length; x += 1) {
        if (
          blocks[y][x] &&
          ((this.playfield[pieceY + y] === undefined ||
              this.playfield[pieceY + y][pieceX + x] === undefined) ||
            this.playfield[pieceY + y][pieceX + x])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  lockPiece() {
    const {
      y: pieceY,
      x: pieceX,
      blocks
    } = this.activePiece;

    for (let y = 0; y < blocks.length; y += 1) {
      for (let x = 0; x < blocks[y].length; x += 1) {
        if (blocks[y][x]) {
          this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }
    this.playSoundIndepended('fall');
  }

  clearLines() {
    const rows = 20;
    const colums = 10;
    let lines = [];

    for (let y = rows - 1; y >= 0; y -= 1) {
      let numberOfBlocks = 0;

      for (let x = 0; x < colums; x += 1) {
        if (this.playfield[y][x]) {
          numberOfBlocks += 1;
        }
      }
      if (numberOfBlocks === 0) {
        break;
      } else if (numberOfBlocks < colums) {
        continue;
      } else if (numberOfBlocks === colums) {
        lines.unshift(y);
        this.playSoundIndepended('clear');
      }
    }

    for (let line of lines) {
      this.playfield.splice(line, 1);
      this.playfield.unshift(new Array(colums).fill(0));
    }

    return lines.length;
  }

  updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += Game.points[clearedLines] * (this.level + 1);
      this.lines += clearedLines;
    }
    if (this.score > this.hiscore) {
      localStorage.setItem('hiscore', this.score);
      this.hiscore = localStorage.getItem('hiscore');
    }
  }

  updatePieces() {
    this.activePiece = this.nextPiece;
    this.nextPiece = this.createPiece();
  }

  playMusic(music = true) {
    if (music) {
      this.sound.getSound().tetrisMain.play();
    }
  }
  pauseMusic(music = true) {
    if (music) {
      this.sound.getSound().tetrisMain.pause();
    }
  }
  // stopMusic() {
  //   if (!this.sound.getSoundState().isMusicOn) {
  //     this.sound.getSound().tetrisMain.pause();
  //     this.sound.getSound().tetrisMain.currentTime = 0;
  //   }
  // }

  playSound(sound) {
    if (this.sound.getSoundState().isSoundOn && !this.hasCollision()) {
      this.sound.getSound()[sound].play();
    }
  }

  playSoundIndepended(sound) {
    if (this.sound.getSoundState().isSoundOn) {
      this.sound.getSound()[sound].play();
    }
  }

  playSoundEndGame({
    score,
    hiscore
  }) {
    const {
      success,
      gameover
    } = this.sound.getSound();

    if (this.sound.getSoundState().isSoundOn && score == hiscore) {
      success.play();
    } else if (this.sound.getSoundState().isSoundOn && score != hiscore) {
      gameover.play();
    }
  }
}