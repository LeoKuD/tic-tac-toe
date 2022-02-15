import React from 'react';
import ReactDOM from 'react-dom';
import { Board } from './components/boadr';
import { GameInfo } from './components/gameInfo';
import { GAME_KEYS, LOCALSTORAGE_KEYS, NAVIGATION_KEYS, SELECTORS_KEYS } from './constants';
import {
  calculateWinner,
  getIndexEasyLevel,
  getIndexHardLevel,
} from './helpers';
import './index.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.refBoard = React.createRef();
    this.state = this.initialState();
    this.modeHandlerClick = this.changeMode.bind(this);
    this.boardHandleClick = this.handleClick.bind(this);
    this.resetGameHandleClick = this.resetGame.bind(this);
    this.jumpToBackHandleClick = this.jumpTo.bind(this, NAVIGATION_KEYS.back);
    this.jumpToNextHandleClick = this.jumpTo.bind(this, NAVIGATION_KEYS.next);
    this.setPlayerMarkXHandleClick = this.changePlayerMark.bind(this, true);
    this.setPlayerMarkOHandleClick = this.changePlayerMark.bind(this, false);
    this.getStartHandleClick = this.getStart.bind(this);
    this.changeLavelHardHandleClick = this.changeLavel.bind(this, true);
    this.changeLavelEasyHandleClick = this.changeLavel.bind(this, false);
  }

  componentDidMount() {
    
  }

  componentDidUpdate() {
    if (
      this.state.isStart &&
      this.state.isComputerMode &&
      this.state.nextPlayer &&
      !this.state.isNavigationMode
    ) {
      this.computerMove();
    }
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  initialState() {
    this.score = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.score)) || {
      x: 0,
      o: 0,
      tie: 0,
      roundCompleted: false,
    };

    return (
      JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.state)) || {
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
        isLevelHard: true,
      }
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    } else {
      this.setState((state) => {
          squares[i] = this.state.nextPlayer ? GAME_KEYS.x : GAME_KEYS.o;
          return {
            history: history.concat([
              {
                squares: squares,
              },
            ]),
            stepNumber: history.length,
            nextPlayer: !state.nextPlayer,
            isNavigationMode: false,
            isStart: true,
          };
      });
    }
  }

  getStart() {
    this.setState((state) => {
      return { isStart: !state.isStart };
    });
  }

  changeLavel(isLavelHard) {
    this.setState((state) => {
      return { isLevelHard: isLavelHard };
    });
  }

  changePlayerMark(mark) {
    this.setState({ nextPlayer: mark, playerOne: mark });
  }

  changeMode() {
    this.setState((state) => {
      return {
        isComputerMode: !state.isComputerMode,
      };
    });
    this.score = {
      x: 0,
      o: 0,
      tie: 0,
      roundCompleted: false,
    };
    localStorage.removeItem(LOCALSTORAGE_KEYS.score);
    this.resetGame();
  }

  getRandomEasy() {
    let current = null;
    this.setState((state) => {
      current = state.history[state.stepNumber].squares;
    });
    return getIndexEasyLevel(current);
  }

  getRandomHard() {
    let current = null;
    let stepNumber = null;
    this.setState((state) => {
      stepNumber = state.stepNumber;
      current = state.history[state.stepNumber].squares;
    });

    return getIndexHardLevel(current, stepNumber);
  }

  computerMove() {
    const nodeBoard = this.refBoard.current;
    nodeBoard.classList.toggle(SELECTORS_KEYS.blocked);
    setTimeout(() => {
      const next = this.state.isLevelHard
        ? this.getRandomHard()
        : this.getRandomEasy();
        nodeBoard.classList.toggle(SELECTORS_KEYS.blocked);
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
    this.setState((state) => {
      let {stepNumber} = state;
      return {
        stepNumber: direction === NAVIGATION_KEYS.back ? --stepNumber : ++stepNumber,
        nextPlayer: state.playerOne
          ? stepNumber % 2 === 0
          : !stepNumber % 2 === 0,
        isNavigationMode: true,
      };
    });
  }

  updateScore(winner) {
    this.score.roundCompleted = true;
    switch (winner) {
      case GAME_KEYS.x:
        this.score.x++;
        break;
      case GAME_KEYS.o:
        this.score.o++;
        break;
      case GAME_KEYS.tie:
        this.score.tie++;
        break;

      default:
        break;
    }
    localStorage.setItem(LOCALSTORAGE_KEYS.score, JSON.stringify(this.score));
  }

  updateStatus() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;

    if (winner && !this.score.roundCompleted) {
      status = `Winner: ${winner}`;
      this.updateScore(winner);
    } else {
      status = `Next player: ${
        this.state.nextPlayer ? GAME_KEYS.x : GAME_KEYS.o
      }`;
    }

    return status
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    let status = this.updateStatus();

    return (
      <div className={SELECTORS_KEYS.game}>
        <div className={SELECTORS_KEYS.status}>{status}</div>
        <div ref={this.refBoard} className={SELECTORS_KEYS.gameBoard}>
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
          changeLavelHardHandleClick={this.changeLavelHardHandleClick}
          changeLavelEasyHandleClick={this.changeLavelEasyHandleClick}
          isLevelHard={this.state.isLevelHard}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
