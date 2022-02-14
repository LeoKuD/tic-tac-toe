import React from 'react';
import ReactDOM from 'react-dom';
import { Board } from './components/boadr';
import { GameInfo } from './components/gameInfo';
import { TICTACTOEKEYS } from './constants';
import { calculateWinner, getIndexEasyLevel, getIndexHardLevel } from './helpers';
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
    this.isLevelHard = true;
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      nextPlayer: true,
      stepNumber: 0,
      isComputerMode: false,
      isNavigationMode: false,
      isStart: false,
      playerOne: true,
    };
    this.modeHandlerClick = this.changeMode.bind(this);
    this.boardHandleClick = this.handleClick.bind(this);
    this.resetGameHandleClick = this.resetGame.bind(this);
    this.jumpToBackHandleClick = this.jumpTo.bind(this, 'back');
    this.jumpToNextHandleClick = this.jumpTo.bind(this, 'next');
    this.setPlayerMarkXHandleClick = this.changePlayerMark.bind(this, true);
    this.setPlayerMarkOHandleClick = this.changePlayerMark.bind(this, false);
    this.getStartHandleClick = this.getStart.bind(this);
    this.changeLavelHandleClick = this.changeLavel.bind(this);
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
        nextPlayer: true,
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
      this.state.nextPlayer &&
      !this.state.isNavigationMode
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
        isNavigationMode: false,
      });
    }
  }

  getStart() {
    this.setState({ isStart: !this.state.isStart });
  }

  changeLavel() {
    this.isLevelHard = !this.isLevelHard;
  }

  changePlayerMark(mark) {
    this.setState({ nextPlayer: mark, playerOne: mark });
  }

  changeMode() {
    this.setState({
      isComputerMode: !this.state.isComputerMode,
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

  getRandomEasy() {
    const history = this.state.history;
    const current = history[this.state.stepNumber].squares;

    return getIndexEasyLevel(current);
  }

  getRandomHard() {
    const history = this.state.history;
    const current = history[this.state.stepNumber].squares;

    return getIndexHardLevel(current, this.state.stepNumber);
  }

  computerMove() {
    const board = document.querySelector('.game-board');
    board.classList.toggle('blocked');
    setTimeout(() => {
      const next = this.isLevelHard ? this.getRandomHard() : this.getRandomEasy();
      board.classList.toggle('blocked');
      this.handleClick(next);
    }, 500);
  }

  resetGame() {
    this.setState({
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      nextPlayer: this.state.playerOne,
      isNavigationMode: false,
    });
    this.score.roundCompleted = false;
  }

  jumpTo(direction) {
    let currentMove = this.state.stepNumber;
    this.setState({
      stepNumber: direction === 'back' ? --currentMove : ++currentMove,
      nextPlayer: this.state.playerOne ? currentMove % 2 === 0 : !currentMove % 2 === 0,
      isNavigationMode: true,
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
      status = `Winner: ${winner}`;
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
          changeLavelHandleClick={this.changeLavelHandleClick}
          isLevelHard={this.isLevelHard}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
