const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#start-button');
const restartBtn = document.querySelector('#restart-button');
const width = 10;
let nextRandom = 0;
let timerId;
let score = 0;
const colors = [
  'DeepSkyBlue',
  'LimeGreen',
  'DarkViolet',
  'Yellow',
  'Blue',
  'DarkOrange',
  'crimson',
];

// Tetrominoes
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const lAltTetromino = [
  [0, 1, width + 1, width * 2 + 1],
  [width + 2, width * 2 + 2, width * 2 + 1, width * 2],
  [1, width + 1, width * 2 + 1, width * 2 + 2],
  [width + 2, width + 1, width, width * 2],
];

const zAltTetromino = [
  [2, width + 2, width + 1, width * 2 + 1],
  [width + 1, width, width * 2 + 2, width * 2 + 1],
  [2, width + 2, width + 1, width * 2 + 1],
  [width + 1, width, width * 2 + 2, width * 2 + 1],
];

const theTetrominoes = [
  lTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
  lAltTetromino,
  zAltTetromino,
];

let currentPosition = 4;
let currentRotation = 0;

// Randomly select a tetromino and its rotation
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][0];

// Draw the Tetromino
function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add('tetromino');
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
}

// Undraw the tetromino
function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove('tetromino');
    squares[currentPosition + index].style.backgroundColor = '';
  });
}

// Assign function to keyCodes
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
document.addEventListener('keydown', control);

// Move down function
function moveDown() {
  freeze();
  undraw();
  currentPosition += width;
  draw();
}

// Freeze function
function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains('taken')
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add('taken')
    );

    // start a new tetromino falling
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
    displayShape();
    addScore();
    gameOver();
    getFaster();
  }
}

// Move the tetromino left, unless at the edge of the grid or blockage
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );
  if (!isAtLeftEdge) currentPosition -= 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains('taken')
    )
  ) {
    currentPosition += 1;
  }

  draw();
}

// Move the tetromino right, unless at the edge of the grid or blockage
function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );
  if (!isAtRightEdge) currentPosition += 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains('taken')
    )
  ) {
    currentPosition -= 1;
  }

  draw();
}

// rotate the tetromino
function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) {
    // if the current rotation gets to 4, go back to 0
    currentRotation = 0;
  }
  current = theTetrominoes[random][currentRotation];
  draw();
}

// show up next tetromino in mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;

// the Tetrominoes without rotations
const upNextTetrominoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2] /* lTetromino */,
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1] /* zTetromino */,
  [1, displayWidth, displayWidth + 1, displayWidth + 2] /* tTetromino */,
  [0, 1, displayWidth, displayWidth + 1] /* oTetromino */,
  [
    1,
    displayWidth + 1,
    displayWidth * 2 + 1,
    displayWidth * 3 + 1,
  ] /* iTetromino */,
  [1, displayWidth + 1, displayWidth * 2 + 1, 0] /* lAltTetromino */,
  [
    2,
    displayWidth + 2,
    displayWidth + 1,
    displayWidth * 2 + 1,
  ] /* zAltTetromino */,
];

// display the shape in mini-grid
function displayShape() {
  // remove any trace of a tetromino from the entire grid
  displaySquares.forEach((square) => {
    square.classList.remove('tetromino');
    square.style.backgroundColor = '';
  });
  upNextTetrominoes[nextRandom].forEach((index) => {
    displaySquares[displayIndex + index].classList.add('tetromino');
    displaySquares[displayIndex + index].style.backgroundColor =
      colors[nextRandom];
  });
}

// add functionality to the button
startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startBtn.innerHTML = 'PLAY <i class="far fa-play-circle"></i>';
    playButton.innerHTML = 'MUTE <i class="fas fa-volume-mute"></i>';
    audio.pause();
  } else {
    draw();
    timerId = setInterval(moveDown, 500);
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    displayShape();
    startBtn.innerHTML = 'PAUSE <i class="far fa-pause-circle"></i>';
    playButton.innerHTML = 'ON <i class="fas fa-volume-up"></i>';

    audio.play();
  }
});

// add score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains('taken'))) {
      score += 100;
      scoreDisplay.innerHTML = score;
      row.forEach((index) => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('tetromino');
        squares[index].style.backgroundColor = '';
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }
}

// game over
function gameOver() {
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains('taken')
    )
  ) {
    scoreDisplay.innerHTML = `You scored ${score} points. <br> Game Over.`;
    clearInterval(timerId);
  }
}

// restart

restartBtn.addEventListener('click', () => {
  window.location.reload();
});

// play-pause
const playButton = document.getElementById('play-button');
const audio = document.getElementById('player');

playButton.addEventListener('click', function () {
  if (audio.paused) {
    audio.play();
    playButton.innerHTML = 'ON <i class="fas fa-volume-up"></i>';
  } else {
    audio.pause();
    playButton.innerHTML = 'MUTE <i class="fas fa-volume-mute"></i>';
  }
});
