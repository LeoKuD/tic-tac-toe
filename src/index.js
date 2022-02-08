import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square({ onClick, value }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ onClick, squares }) {
  function renderSquare(i) {
    function handlerClick() {
      onClick(i);
    }
    return <Square value={squares[i]} onClick={handlerClick} />;
  }
  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.score = {
      x: 0,
      o: 0,
      tie: 0,
    };
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      isComputerMode: false,
    };
    this.modeHandlerClick = this.changeMode.bind(this);
    this.boardHandleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState !== this.state &&
      this.state.isComputerMode &&
      this.state.xIsNext
    ) {
      this.computerMove();
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  changeMode() {
    this.setState((state) => {
      return { isComputerMode: !state.isComputerMode };
    });
    this.score = {
      x: 0,
      o: 0,
      tie: 0,
    };
    localStorage.removeItem('score');
    this.resetGame();
  }

  getRandom() {
    let emptySquares = [];
    const { history, stepNumber } = this.state;
    history[stepNumber].squares.forEach((element, index) => {
      if (!element) {
        emptySquares.push(index);
      }
    });
    const randomSquares =
      emptySquares[Math.floor(Math.random() * emptySquares.length)];
    return randomSquares;
  }

  computerMove() {
    setTimeout(() => {
      const next = this.getRandom();
      this.handleClick(next);
    }, 500);
  }

  resetGame() {
    this.setState({
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
    });
  }

  jumpTo(decrement) {
    let currentMove = this.state.stepNumber;
    this.setState({
      stepNumber: decrement === 'decrement'? --currentMove: ++currentMove,
      xIsNext: currentMove % 2 === 0,
    });
  }

  updateScore(winner) {
    switch (winner) {
      case 'X':
        this.score.x++;
        break;
      case 'O':
        this.score.o++;
        break;
      case 'tie':
        this.score.tie++;
        break;

      default:
        break;
    }
    localStorage.setItem('score', JSON.stringify(this.score));
  }

  render() {
    this.score = JSON.parse(localStorage.getItem('score')) || {
      x: 0,
      o: 0,
      tie: 0,
    };
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;

    if (winner) {
      status = `Выйграл ${winner}`;
      this.updateScore(winner);
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={this.boardHandleClick} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>
            <button
              onClick={() => {
                this.resetGame();
              }}
            >
              'Reset'
            </button>
            <button
              disabled={this.state.stepNumber ? false : true}
              onClick={() => {
                this.jumpTo('decrement');
              }}
            >
              'Back'
            </button>
            <button
              disabled={
                this.state.stepNumber + 1 < history.length ? false : true
              }
              onClick={() => {
                this.jumpTo();
              }}
            >
              'Next'
            </button>
          </ol>
        </div>
        <div className="mode">
          <button onClick={this.modeHandlerClick}>
            Mode: {this.state.isComputerMode ? 'Computer' : 'Players'}
          </button>
        </div>
        <div className="score">
          <p>
            {(this.state.isComputerMode ? `Computer X` : `Player X`) +
              `: ${this.score.x}`}
          </p>
          <p>tie: {this.score.tie}</p>
          <p>{`Player O: ${this.score.o}`}</p>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const countSteps = squares.filter((item) => item);
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (countSteps.length === 9) {
    return 'tie';
  }
  return null;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
