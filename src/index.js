import React from 'react';
import ReactDOM from 'react-dom';
import { Board } from './components/boadr';
import { GameInfo } from './components/gameInfo';
import {
  GAME_KEYS,
  LOCALSTORAGE_KEYS,
  NAVIGATION_KEYS,
  SELECTORS_KEYS,
} from './constants';
import {
  calculateWinner,
  getIndexEasyLevel,
  getIndexHardLevel,
  initialState,
  initialStaticVariables,
} from './helpers';
import './index.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.refBoard = React.createRef();
    this.score = initialStaticVariables();
    this.state = initialState();
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
    const state = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.state));
    const score = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.score));
    if (state) {
      this.setState(state);
    }
    if (score) {
      this.score = score;
    }
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

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    } else {
      this.setState((prevState) => {
        squares[i] = prevState.nextPlayer ? GAME_KEYS.x : GAME_KEYS.o;
        if (prevState.isStart) {
          return {
            ...prevState,
            history: history.concat([
              {
                squares: squares,
              },
            ]),
            stepNumber: history.length,
            nextPlayer: !prevState.nextPlayer,
            isNavigationMode: false,
            isStart: true,
          };
        } else {
          return { ...prevState, isStart: true };
        }
      });
    }
  }

  getStart() {
    this.setState((prevState) =>
      !prevState.isStart
        ? { ...prevState, isStart: !prevState.isStart }
        : {
            ...initialState(),
            nextPlayer: prevState.playerOne,
            isComputerMode: prevState.isComputerMode,
            isLevelHard: prevState.isLevelHard,
            isStart: !prevState.isStart,
          }
    );
  }

  changeLavel(isLevelHard) {
    this.setState({ isLevelHard });
  }

  changePlayerMark(mark) {
    this.setState({ nextPlayer: mark, playerOne: mark });
  }

  changeMode() {
    this.setState((prevState) => {
      return {
        ...prevState,
        isComputerMode: !prevState.isComputerMode,
      };
    });
    this.score = {
      ...initialStaticVariables(),
    };
    localStorage.removeItem(LOCALSTORAGE_KEYS.score);
    this.resetGame();
  }

  computerMove() {
    const current = this.state.history[this.state.stepNumber].squares;
    const nodeBoard = this.refBoard.current;
    nodeBoard.classList.toggle(SELECTORS_KEYS.blocked);
    setTimeout(() => {
      const next = this.state.isLevelHard
        ? getIndexHardLevel(current, this.state.stepNumber)
        : getIndexEasyLevel(current);
      nodeBoard.classList.toggle(SELECTORS_KEYS.blocked);
      this.handleClick(next);
    }, 500);
  }

  resetGame() {
    this.setState((prevState) =>
      prevState.stepNumber
        ? {
            ...initialState(),
            nextPlayer: prevState.playerOne,
            isComputerMode: prevState.isComputerMode,
            isLevelHard: prevState.isLevelHard,
            isStart: prevState.isStart,
          }
        : {
            ...prevState,
            isStart: false,
          }
    );
    this.score.roundCompleted = false;
  }

  jumpTo(direction) {
    this.setState((prevState) => {
      let { stepNumber } = prevState;
      return {
        ...prevState,
        stepNumber:
          direction === NAVIGATION_KEYS.back ? --stepNumber : ++stepNumber,
        nextPlayer: prevState.playerOne
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

    return status;
  }

  render() {
    return (
      <div className={SELECTORS_KEYS.game}>
        <div className={SELECTORS_KEYS.status}>{this.updateStatus()}</div>
        <div ref={this.refBoard} className={SELECTORS_KEYS.gameBoard}>
          <Board
            squares={this.state.history[this.state.stepNumber].squares}
            onClick={this.boardHandleClick}
          />
        </div>
        <GameInfo
          score={this.score}
          isComputerMode={this.state.isComputerMode}
          status={this.updateStatus()}
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
