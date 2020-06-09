"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.querySelector('.grid');
  var squares = Array.from(document.querySelectorAll('.grid div'));
  var scoreDisplay = document.querySelector('#score');
  var startBtn = document.querySelector('#start-button');
  var width = 10;
  var nextRandom = 0;
  var timerId;
  var score = 0;
  var colors = ['orange', 'red', 'purple', 'green', 'blue']; //The Tetrominoes

  var lTetromino = [[1, width + 1, width * 2 + 1, 2], [width, width + 1, width + 2, width * 2 + 2], [1, width + 1, width * 2 + 1, width * 2], [width, width * 2, width * 2 + 1, width * 2 + 2]];
  var zTetromino = [[0, width, width + 1, width * 2 + 1], [width + 1, width + 2, width * 2, width * 2 + 1], [0, width, width + 1, width * 2 + 1], [width + 1, width + 2, width * 2, width * 2 + 1]];
  var tTetromino = [[1, width, width + 1, width + 2], [1, width + 1, width + 2, width * 2 + 1], [width, width + 1, width + 2, width * 2 + 1], [1, width, width + 1, width * 2 + 1]];
  var oTetromino = [[0, 1, width, width + 1], [0, 1, width, width + 1], [0, 1, width, width + 1], [0, 1, width, width + 1]];
  var iTetromino = [[1, width + 1, width * 2 + 1, width * 3 + 1], [width, width + 1, width + 2, width + 3], [1, width + 1, width * 2 + 1, width * 3 + 1], [width, width + 1, width + 2, width + 3]];
  var theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
  var currentPosition = 4;
  var currentRotation = 0; //randomly select a Tetromino and its first rotation

  var random = Math.floor(Math.random() * theTetrominoes.length);
  var current = theTetrominoes[random][currentRotation]; //draw the Tetromino

  function draw() {
    current.forEach(function (index) {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  } //undraw the Tetromino


  function undraw() {
    current.forEach(function (index) {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  } //assign functions to keyCodes


  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener('keyup', control); //move down function

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  } //freeze function


  function freeze() {
    if (current.some(function (index) {
      return squares[currentPosition + index + width].classList.contains('taken');
    })) {
      current.forEach(function (index) {
        return squares[currentPosition + index].classList.add('taken');
      }); //start a new tetromino falling

      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  } //move the tetromino left, unless is at the edge or there is a blockage


  function moveLeft() {
    undraw();
    var isAtLeftEdge = current.some(function (index) {
      return (currentPosition + index) % width === 0;
    });

    if (!isAtLeftEdge) {
      currentPosition -= 1;
    }

    if (current.some(function (index) {
      return squares[currentPosition + index].classList.contains('taken');
    })) {
      currentPosition += 1;
    }

    draw();
  } //move the tetromino right, unless is at the edge or there is a blockage


  function moveRight() {
    undraw();
    var isAtRightEdge = current.some(function (index) {
      return (currentPosition + index) % width === width - 1;
    });

    if (!isAtRightEdge) {
      currentPosition += 1;
    }

    if (current.some(function (index) {
      return squares[currentPosition + index].classList.contains('taken');
    })) {
      currentPosition -= 1;
    }

    draw();
  } ///FIX ROTATION OF TETROMINOS A THE EDGE 


  function isAtRight() {
    return current.some(function (index) {
      return (currentPosition + index + 1) % width === 0;
    });
  }

  function isAtLeft() {
    return current.some(function (index) {
      return (currentPosition + index) % width === 0;
    });
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.

    if ((P + 1) % width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1; //if so, add one to wrap it back around

        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  } //rotate the tetromino


  function rotate() {
    undraw();
    currentRotation += 1;

    if (currentRotation === current.length) {
      //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }

    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  } /////////
  //show up-next tetromino in mini-grid display


  var displaySquares = document.querySelectorAll('.mini-grid div');
  var displayWidth = 4;
  var displayIndex = 0; //the Tetrominos without rotations

  var upNextTetrominoes = [[1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
  [0, 1, displayWidth, displayWidth + 1], //oTetromino
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
  ]; //display the shape in the mini-grid display

  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(function (square) {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    upNextTetrominoes[nextRandom].forEach(function (index) {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  } //add functionality to the button


  startBtn.addEventListener('click', function () {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  }); //add score

  function addScore() {
    for (var i = 0; i < 199; i += width) {
      var row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

      if (row.every(function (index) {
        return squares[index].classList.contains('taken');
      })) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(function (index) {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });
        var squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(function (cell) {
          return grid.appendChild(cell);
        });
      }
    }
  } //game over


  function gameOver() {
    if (current.some(function (index) {
      return squares[currentPosition + index].classList.contains('taken');
    })) {
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
      document.removeEventListener("keyup", control);
    }
  }
});