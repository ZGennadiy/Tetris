export default class View {
  static colors = {
    '1': 'cyan',
    '2': 'blue',
    '3': 'yellow',
    '4': 'orange',
    '5': 'green',
    '6': 'purple',
    '7': 'red',
  }

  constructor(element, {
    width,
    height,
    rows,
    colums
  }, sound) {
    this.element = element;
    this.sound = sound;
    this.width = width;
    this.height = height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');

    this.playfieldBorderWidth = 2;
    this.playfieldX = this.playfieldBorderWidth;
    this.playfieldY = this.playfieldBorderWidth;
    this.playfieldWidth = this.width * 2 / 3;
    this.playfieldHeight = this.height;
    this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
    this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;

    this.blockWidth = this.playfieldInnerWidth / colums;
    this.blockHeight = this.playfieldInnerHeight / rows;

    this.panelX = this.playfieldWidth + 5;
    this.panelY = 0;
    this.panelWidth = this.width / 3;
    this.panelHeight = this.height;

    this.element.appendChild(this.canvas);

  }

  renderMainScreen(state) {
    this.clearScreen();
    this.renderPlayfield(state);
    this.renderPanel(state);

  }

  renderStartScreen() {
    this.context.fillStyle = 'black';
    this.context.font = '14px "Press Start 2P"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
  }

  renderPauseScreen() {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.fillStyle = 'white';
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
  }

  renderEndScreen({
    score,
    hiscore
  }) {
    this.clearScreen();

    this.context.fillStyle = 'black';
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
    if (score == hiscore) {
      this.context.fillText(`It's a new record: ${hiscore}`, this.width / 2, this.height / 2);
    } else {
      this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
    }
    this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 48);
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  renderPlayfield({
    playfield
  }) {
    for (let y = 0; y < playfield.length; y += 1) {
      const line = playfield[y];

      for (let x = 0; x < line.length; x += 1) {
        const block = line[x];

        if (block) {
          this.renderBlock(
            this.playfieldX + (x * this.blockWidth),
            this.playfieldY + (y * this.blockHeight),
            this.blockWidth,
            this.blockHeight,
            View.colors[block]
          );
        }
      }
    }
    this.context.strokeStyle = 'black';
    this.context.lineWidth = this.playfieldBorderWidth;
    this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);
  }

  renderPanel({
    level,
    score,
    hiscore,
    lines,
    nextPiece,
    isSoundOn,
    isMusicOn
  }) {
    this.context.textAlign = 'start';
    this.context.textBaseline = 'top';
    this.context.fillStyle = 'black';
    this.context.font = '10px "Press start 2P"';
    this.context.fillText(`HiScore`, this.panelX, this.panelY + 5);
    this.context.fillText(`${hiscore}`, this.panelX, this.panelY + 20);
    this.context.fillText(`Score`, this.panelX, this.panelY + 40);
    this.context.fillText(`${score}`, this.panelX, this.panelY + 55);
    this.context.fillText(`Lines`, this.panelX, this.panelY + 75);
    this.context.fillText(`${lines}`, this.panelX, this.panelY + 90);
    this.context.fillText(`Level`, this.panelX, this.panelY + 110);
    this.context.fillText(`${level}`, this.panelX, this.panelY + 125);
    this.context.fillText(`Next`, this.panelX, this.panelY + 145);
    this.context.fillText(`Music`, this.panelX, this.panelY + 250);
    if (isMusicOn) {
      this.context.fillText(`On`, this.panelX, this.panelY + 265);
    } else {
      this.context.fillText(`Off`, this.panelX, this.panelY + 265);
    }
    this.context.fillText(`Sound`, this.panelX, this.panelY + 285);
    if (isSoundOn) {
      this.context.fillText(`On`, this.panelX, this.panelY + 305);
    } else {
      this.context.fillText(`Off`, this.panelX, this.panelY + 305);
    }

    for (let y = 0; y < nextPiece.blocks.length; y += 1) {
      for (let x = 0; x < nextPiece.blocks[y].length; x += 1) {
        const block = nextPiece.blocks[y][x];

        if (block) {
          this.renderBlock(
            this.panelX + (x * this.blockWidth * 0.5),
            this.panelY + 155 + (y * this.blockHeight * 0.5),
            this.blockWidth * 0.5,
            this.blockHeight * 0.5,
            View.colors[block]
          );
        }

      }

    }
  }

  renderBlock(x, y, width, height, color) {
    this.context.fillStyle = color;
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 1;

    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x, y, width, height);
  }
}