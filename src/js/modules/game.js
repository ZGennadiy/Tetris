export default class Game {
  score = 0;
  lines = 0;
  level = 0;
  playfield = this.createPlayfield();
  activePiece = this.createPiece();
  nextPiece = this.createPiece();

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
      playfield,
    };
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
    }
  }

  movePieceRight() {
    this.activePiece.x += 1;
    if (this.hasCollision()) {
      this.activePiece.x -= 1;
    }
  }

  movePieceDown() {
    this.activePiece.y += 1;
    if (this.hasCollision()) {
      this.activePiece.y -= 1;
      this.lockPiece();
      this.updatePieces();
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
  }

  updatePieces() {
    this.activePiece = this.nextPiece;
    this.nextPiece = this.createPiece();
  }
}