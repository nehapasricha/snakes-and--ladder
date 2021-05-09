const board = [];
const width = 9;
const height = 9;
const players = [
  {
    name: "Cloud",
    position: 0,
    color: "gold",
  },
  {
    name: "Sky",
    position: 0,
    color: "blue",
  },
];

const ladders = [
  {
    start: 2,
    end: 22,
  },
  {
    start: 50,
    end: 34,
  },
  {
    start: 10,
    end: 44,
  },
  {
    start: 61,
    end: 19,
  },
  {
    start: 72,
    end: 42,
  },
  {
    start: 66,
    end: 55,
  },
];

let blackSquare = false;

let currentPlayerTurn = 0;

let position = 0;
var hasWon = false;

for (let y = height; y > 0; y--) {
  let row = [];
  board.push(row);
  for (let x = 0; x < width; x++) {
    row.push({
      x,
      y,
      occupied: null,
      position,
      color: blackSquare ? "steelblue" : "silver",
    });
    blackSquare = !blackSquare;
    position++;
  }
}

const renderBoard = () => {
  let html = ``;
  const boardSizeConst = 50;
  board.forEach((row) => {
    row.forEach((square) => {
      html += `<div class="square" id="${square.position}" style="top: ${
        square.y * boardSizeConst
      }px; left: ${square.x * boardSizeConst}px; background-color: ${
        square.color
      }"></div>`;
    });
  });

  players.forEach((player) => {
    let square = null;

    board.forEach((row) => {
      row.forEach((square) => {
        if (square.position === player.position) {
          html += `<div class="player" style="top: ${
            square.y * boardSizeConst + 5
          }px; left: ${square.x * boardSizeConst + 5}px;background-color:${
            player.color
          }"></div>`;
        }
      });
    });
  });

  ladders.forEach((ladder) => {
    let startPos = { x: 0, y: 0 };
    let endPos = { x: 0, y: 0 };

    board.forEach((row) => {
      row.forEach((square) => {
        if (square.position === ladder.start) {
          startPos.x = square.x * boardSizeConst;
          startPos.y = square.y * boardSizeConst;
        }

        if (square.position === ladder.end) {
          endPos.x = square.x * boardSizeConst;
          endPos.y = square.y * boardSizeConst;
        }
      });
    });

    const isLadder = ladder.end > ladder.start;
    drawLine({ color: isLadder ? "green" : "red", startPos, endPos });
  });

  document.getElementById("board").innerHTML = html;
};

function rollDice() {
  if (hasWon) {
    return;
  }
  const max = 6;
  const min = 1;

  const roll = Math.floor(Math.random() * (max - min + 1)) + min;
  let currentPlayer = players[currentPlayerTurn];
  currentPlayer.position += roll;
  ladders.forEach((ladder) => {
    if (ladder.start === currentPlayer.position) {
      currentPlayer.position = ladder.end;
    }
  });

  if (currentPlayer.position === position) {
    console.log("Player has won!");
    hasWon = true;
  }
  if (currentPlayer.position > position) {
    const diff = currentPlayer.position - position;
    currentPlayer.position = position - diff;
  }

  currentPlayerTurn++;
  if (currentPlayerTurn >= players.length) {
    currentPlayerTurn = 0;
  }
  renderBoard();
}

function drawLine({ color, startPos, endPos }) {
  let c = document.getElementById("canvas");
  let ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(startPos.x, startPos.y);
  ctx.lineTo(endPos.x, endPos.y);
  ctx.lineWidth = 15;
  ctx.strokeStyle = color;
  ctx.stroke();
}

renderBoard();
