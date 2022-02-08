import React from 'react';
import ReactDOM from 'react-dom';
import { Board } from './components/boadr';
import { GameInfo } from './components/gameInfo';
import { TICTACTOEKEYS } from './constants';
import { calculateWinner } from './helpers';
import './index.css';

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
    this.resetGameHandleClick = this.resetGame.bind(this);
    this.jumpToBackHandleClick = this.jumpTo.bind(this, 'decrement');
    this.jumpToNextHandleClick = this.jumpTo.bind(this);
  }

  componentDidMount() {
    this.setState(
      JSON.parse(localStorage.getItem('state')) || {
        history: [
          {
            squares: Array(9).fill(null),
          },
        ],
        xIsNext: true,
        stepNumber: 0,
        isComputerMode: false,
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState !== this.state &&
      this.state.isComputerMode &&
      this.state.xIsNext
    ) {
      this.computerMove();
    }
    if (prevState !== this.state) {
      localStorage.setItem('state', JSON.stringify(this.state));
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? TICTACTOEKEYS.x : TICTACTOEKEYS.o;
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
    const board = document.querySelector('.game-board');
    board.classList.toggle('blocked');
    setTimeout(() => {
      const next = this.getRandom();
      board.classList.toggle('blocked');
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
      stepNumber: decrement === 'decrement' ? --currentMove : ++currentMove,
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
      status = `Next player: ${
        this.state.xIsNext ? TICTACTOEKEYS.x : TICTACTOEKEYS.o
      }`;
    }
    return (
      <div className="game">
        <div className="status">{status}</div>
        <div className="game-board">
          <Board squares={current.squares} onClick={this.boardHandleClick} />
        </div>
        <GameInfo
          score={this.score}
          isComputerMode={this.state.isComputerMode}
          status={status}
          resetGameHandleClick={this.resetGameHandleClick}
          stepNumber={this.state.stepNumber}
          jumpToBackHandleClick={this.jumpToBackHandleClick}
          history={this.state.history}
          jumpToNextHandleClick={this.jumpToNextHandleClick}
          modeHandlerClick={this.modeHandlerClick}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
