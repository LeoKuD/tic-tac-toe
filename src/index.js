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
      roundCompleted: false,
    };
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      nextPlayer: false,
      stepNumber: 0,
      isComputerMode: false,
      isStart: false,
      playerOne: true,
    };
    this.modeHandlerClick = this.changeMode.bind(this);
    this.boardHandleClick = this.handleClick.bind(this);
    this.resetGameHandleClick = this.resetGame.bind(this);
    this.jumpToBackHandleClick = this.jumpTo.bind(this, 'decrement');
    this.jumpToNextHandleClick = this.jumpTo.bind(this);
    this.setPlayerMarkXHandleClick = this.changePlayerMark.bind(this, true);
    this.setPlayerMarkOHandleClick = this.changePlayerMark.bind(this, false);
    this.getStartHandleClick = this.getStart.bind(this);
  }

  componentDidMount() {
    this.score = JSON.parse(localStorage.getItem('score')) || {
      x: 0,
      o: 0,
      tie: 0,
    };
    this.setState(
      JSON.parse(localStorage.getItem('state')) || {
        history: [
          {
            squares: Array(9).fill(null),
          },
        ],
        nextPlayer: false,
        stepNumber: 0,
        isComputerMode: false,
        isStart: false,
        playerOne: true,
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.isStart &&
      this.state.isComputerMode &&
      this.state.nextPlayer
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

    if (this.state.isStart) {
      squares[i] = this.state.nextPlayer ? TICTACTOEKEYS.x : TICTACTOEKEYS.o;
      this.setState({
        history: history.concat([
          {
            squares: squares,
          },
        ]),
        stepNumber: history.length,
        nextPlayer: !this.state.nextPlayer,
      });
    }
  }

  getStart() {
    this.setState({ isStart: true });
  }

  changePlayerMark(mark) {
    this.setState((state) => {
      return { nextPlayer: mark, playerOne: mark };
    });
  }
  changeMode() {
    this.setState({
      isComputerMode: !this.state.isComputerMode,
      isStart: false,
    });
    this.score = {
      x: 0,
      o: 0,
      tie: 0,
      roundCompleted: false,
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

  random2() {
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
    const history = this.state.history;
    const current = history[this.state.stepNumber].squares;
    let availableСombinationsX = [];
    let availableСombinationsO = [];
    let computerWinnerСombinations = [];
    let playerWinnerСombinations = [];
    let index = null;

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        (current[a] === 'O' && current[b] === 'O' && !current[c]) ||
        (current[a] === 'O' && current[c] === 'O' && !current[b]) ||
        (current[b] === 'O' && current[c] === 'O' && !current[a])
      ) {
        playerWinnerСombinations.push([a, b, c]);
      }
      if (
        (current[a] === 'X' && current[b] === 'X' && !current[c]) ||
        (current[a] === 'X' && current[c] === 'X' && !current[b]) ||
        (current[b] === 'X' && current[c] === 'X' && !current[a])
      ) {
        computerWinnerСombinations.push([a, b, c]);
      }
      if (
        (current[a] === 'X' && !current[b] && !current[c]) ||
        (current[b] === 'X' && !current[a] && !current[c]) ||
        (current[c] === 'X' && !current[a] && !current[b])
      ) {
        availableСombinationsX.push([a, b, c]);
      }
      if (
        (current[a] === 'O' && !current[b] && !current[c]) ||
        (current[b] === 'O' && !current[a] && !current[c]) ||
        (current[c] === 'O' && !current[a] && !current[b])
      ) {
        availableСombinationsO.push([a, b, c]);
      }
    }

    if (computerWinnerСombinations.length) {
      let random = computerWinnerСombinations[
        Math.floor(Math.random() * computerWinnerСombinations.length)
      ].filter((item) => !current[item]);
      random = random[Math.floor(Math.random() * random.length)];
      index = random;
    } else if (playerWinnerСombinations.length) {
      let random = playerWinnerСombinations[
        Math.floor(Math.random() * playerWinnerСombinations.length)
      ].filter((item) => !current[item]);
      random = random[Math.floor(Math.random() * random.length)];
      index = random;
    } else if (
      this.state.stepNumber > 1 &&
      (availableСombinationsX.length || availableСombinationsO.length)
    ) {
      let randomX = availableСombinationsX[
        Math.floor(Math.random() * availableСombinationsX.length)
      ].filter((item) => !current[item]);
      randomX = randomX[Math.floor(Math.random() * randomX.length)];
      index = randomX;
    } 
    else {
      index = this.getRandom()
    }

    return index
  }

  computerMove() {
    const board = document.querySelector('.game-board');
    board.classList.toggle('blocked');
    setTimeout(() => {
      const next = this.random2();
      board.classList.toggle('blocked');
      this.handleClick(next);
    }, 500);
  }

  resetGame() {
    this.setState({
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      nextPlayer: this.state.playerOne,
    });
    this.score.roundCompleted = false;
  }

  jumpTo(decrement) {
    let currentMove = this.state.stepNumber;
    this.setState({
      stepNumber: decrement === 'decrement' ? --currentMove : ++currentMove,
      nextPlayer: currentMove % 2 === 0,
    });
  }

  updateScore(winner) {
    this.score.roundCompleted = true;
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
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;

    if (winner && !this.score.roundCompleted) {
      status = `Выйграл ${winner}`;
      this.updateScore(winner);
    } else {
      status = `Next player: ${
        this.state.nextPlayer ? TICTACTOEKEYS.x : TICTACTOEKEYS.o
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
          playerOne={this.state.playerOne}
          setPlayerMarkXHandleClick={this.setPlayerMarkXHandleClick}
          setPlayerMarkOHandleClick={this.setPlayerMarkOHandleClick}
          getStartHandleClick={this.getStartHandleClick}
          isStart={this.state.isStart}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
