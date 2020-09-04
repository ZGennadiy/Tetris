function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game = /*#__PURE__*/function () {
  function Game(sound) {
    this.sound = sound;
    this.reset();
  }

  var _proto = Game.prototype;

  _proto.getState = function getState() {
    var playfield = this.createPlayfield();
    var _this$activePiece = this.activePiece,
        pieceY = _this$activePiece.y,
        pieceX = _this$activePiece.x,
        blocks = _this$activePiece.blocks;

    for (var y = 0; y < this.playfield.length; y += 1) {
      playfield[y] = [];

      for (var x = 0; x < this.playfield[y].length; x += 1) {
        playfield[y][x] = this.playfield[y][x];
      }
    }

    for (var _y = 0; _y < blocks.length; _y += 1) {
      for (var _x = 0; _x < blocks[_y].length; _x += 1) {
        if (blocks[_y][_x]) {
          playfield[pieceY + _y][pieceX + _x] = blocks[_y][_x];
        }
      }
    }

    return {
      level: this.level,
      lines: this.lines,
      score: this.score,
      hiscore: this.hiscore,
      nextPiece: this.nextPiece,
      playfield: playfield,
      isGameOver: this.topOut,
      isSoundOn: this.sound.getSoundState().isSoundOn,
      isMusicOn: this.sound.getSoundState().isMusicOn
    };
  };

  _proto.reset = function reset() {
    this.score = 0;
    this.hiscore = localStorage.getItem('hiscore') || 0;
    this.lines = 0;
    this.topOut = false;
    this.playfield = this.createPlayfield();
    this.activePiece = this.createPiece();
    this.nextPiece = this.createPiece();
  };

  _proto.createPlayfield = function createPlayfield(emptyBlock) {
    if (emptyBlock === void 0) {
      emptyBlock = 0;
    }

    var playfield = [];

    for (var y = 0; y < 20; y += 1) {
      playfield[y] = [];

      for (var x = 0; x < 10; x += 1) {
        playfield[y][x] = emptyBlock;
      }
    }

    return playfield;
  };

  _proto.createPiece = function createPiece() {
    var index = Math.floor(Math.random() * 7);
    var types = 'IJLOSTZ';
    var type = types[index];
    var piece = {};

    switch (type) {
      case 'I':
        piece.blocks = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]];
        break;

      case 'J':
        piece.blocks = [[0, 0, 0], [2, 2, 2], [0, 0, 2]];
        break;

      case 'L':
        piece.blocks = [[0, 0, 0], [3, 3, 3], [3, 0, 0]];
        break;

      case 'O':
        piece.blocks = [[0, 0, 0, 0], [0, 4, 4, 0], [0, 4, 4, 0], [0, 0, 0, 0]];
        break;

      case 'S':
        piece.blocks = [[0, 0, 0], [0, 5, 5], [5, 5, 0]];
        break;

      case 'T':
        piece.blocks = [[0, 0, 0], [6, 6, 6], [0, 6, 0]];
        break;

      case 'Z':
        piece.blocks = [[0, 0, 0], [7, 7, 0], [0, 7, 7]];
        break;

      default:
        throw new Error("Unknown type of piece: " + type);
    }

    piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
    piece.y = -1;
    return piece;
  };

  _proto.movePieceLeft = function movePieceLeft() {
    this.activePiece.x -= 1;

    if (this.hasCollision()) {
      this.activePiece.x += 1;
    } else {
      this.playSound('whoosh');
    }
  };

  _proto.movePieceRight = function movePieceRight() {
    this.activePiece.x += 1;

    if (this.hasCollision()) {
      this.activePiece.x -= 1;
    } else {
      this.playSound('whoosh');
    }
  };

  _proto.movePieceDown = function movePieceDown() {
    if (this.topOut) {
      return;
    }

    this.activePiece.y += 1;

    if (this.hasCollision()) {
      this.activePiece.y -= 1;
      this.lockPiece();
      var numOfClearedLines = this.clearLines();
      this.updateScore(numOfClearedLines);
      this.updatePieces();
    }

    if (this.hasCollision()) {
      this.topOut = true;
      this.pauseMusic();
      this.playSoundEndGame(this.getState());
    }
  };

  _proto.rotatePiece = function rotatePiece() {
    this.rotateBlocks();

    if (this.hasCollision()) {
      this.rotateBlocks(false);
    }
  };

  _proto.rotateBlocks = function rotateBlocks(clockwise) {
    if (clockwise === void 0) {
      clockwise = true;
    }

    var blocks = this.activePiece.blocks;
    var length = blocks.length;
    var x = Math.floor(length / 2);
    var y = length - 1;

    for (var i = 0; i < x; i += 1) {
      for (var j = i; j < y - i; j += 1) {
        var temp = blocks[i][j];

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
  };

  _proto.hasCollision = function hasCollision() {
    var _this$activePiece2 = this.activePiece,
        pieceY = _this$activePiece2.y,
        pieceX = _this$activePiece2.x,
        blocks = _this$activePiece2.blocks;

    for (var y = 0; y < blocks.length; y += 1) {
      for (var x = 0; x < blocks[y].length; x += 1) {
        if (blocks[y][x] && (this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined || this.playfield[pieceY + y][pieceX + x])) {
          return true;
        }
      }
    }

    return false;
  };

  _proto.lockPiece = function lockPiece() {
    var _this$activePiece3 = this.activePiece,
        pieceY = _this$activePiece3.y,
        pieceX = _this$activePiece3.x,
        blocks = _this$activePiece3.blocks;

    for (var y = 0; y < blocks.length; y += 1) {
      for (var x = 0; x < blocks[y].length; x += 1) {
        if (blocks[y][x]) {
          this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }

    this.playSoundIndepended('fall');
  };

  _proto.clearLines = function clearLines() {
    var rows = 20;
    var colums = 10;
    var lines = [];

    for (var y = rows - 1; y >= 0; y -= 1) {
      var numberOfBlocks = 0;

      for (var x = 0; x < colums; x += 1) {
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

    for (var _i = 0, _lines = lines; _i < _lines.length; _i++) {
      var line = _lines[_i];
      this.playfield.splice(line, 1);
      this.playfield.unshift(new Array(colums).fill(0));
    }

    return lines.length;
  };

  _proto.updateScore = function updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += Game.points[clearedLines] * (this.level + 1);
      this.lines += clearedLines;
    }

    if (this.score > this.hiscore) {
      localStorage.setItem('hiscore', this.score);
      this.hiscore = localStorage.getItem('hiscore');
    }
  };

  _proto.updatePieces = function updatePieces() {
    this.activePiece = this.nextPiece;
    this.nextPiece = this.createPiece();
  };

  _proto.playMusic = function playMusic(music) {
    if (music === void 0) {
      music = true;
    }

    if (music) {
      this.sound.getSound().tetrisMain.play();
    }
  };

  _proto.pauseMusic = function pauseMusic(music) {
    if (music === void 0) {
      music = true;
    }

    if (music) {
      this.sound.getSound().tetrisMain.pause();
    }
  };

  _proto.playSound = function playSound(sound) {
    if (this.sound.getSoundState().isSoundOn && !this.hasCollision()) {
      this.sound.getSound()[sound].play();
    }
  };

  _proto.playSoundIndepended = function playSoundIndepended(sound) {
    if (this.sound.getSoundState().isSoundOn) {
      this.sound.getSound()[sound].play();
    }
  };

  _proto.playSoundEndGame = function playSoundEndGame(_ref) {
    var score = _ref.score,
        hiscore = _ref.hiscore;

    var _this$sound$getSound = this.sound.getSound(),
        success = _this$sound$getSound.success,
        gameover = _this$sound$getSound.gameover;

    if (this.sound.getSoundState().isSoundOn && score == hiscore) {
      success.play();
    } else if (this.sound.getSoundState().isSoundOn && score != hiscore) {
      gameover.play();
    }
  };

  _createClass(Game, [{
    key: "level",
    get: function get() {
      return Math.floor(this.lines * 0.1);
    }
  }]);

  return Game;
}();

Game.points = {
  '1': 40,
  '2': 100,
  '3': 300,
  '4': 1200
};
export { Game as default };