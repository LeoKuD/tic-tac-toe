import { LINES } from "./constants";
import style from './components/score/index.module.css';


export function calculateWinner(squares) {
    const countSteps = squares.filter((item) => item);

    for (let i = 0; i < LINES.length; i++) {
      const [a, b, c] = LINES[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (countSteps.length === 9) {
      return 'tie';
    }
    return null;
  }

  export function getIndexHardLevel(currentGameState, stepNumber) {
    let availableСombinationsX = [];
    let availableСombinationsO = [];
    let computerWinnerСombinations = [];
    let playerWinnerСombinations = [];
    let index = null;

    for (let i = 0; i < LINES.length; i++) {
      const [a, b, c] = LINES[i];
      if (
        (currentGameState[a] === 'O' && currentGameState[b] === 'O' && !currentGameState[c]) ||
        (currentGameState[a] === 'O' && currentGameState[c] === 'O' && !currentGameState[b]) ||
        (currentGameState[b] === 'O' && currentGameState[c] === 'O' && !currentGameState[a])
      ) {
        playerWinnerСombinations.push([a, b, c]);
      }
      if (
        (currentGameState[a] === 'X' && currentGameState[b] === 'X' && !currentGameState[c]) ||
        (currentGameState[a] === 'X' && currentGameState[c] === 'X' && !currentGameState[b]) ||
        (currentGameState[b] === 'X' && currentGameState[c] === 'X' && !currentGameState[a])
      ) {
        computerWinnerСombinations.push([a, b, c]);
      }
      if (
        (currentGameState[a] === 'X' && !currentGameState[b] && !currentGameState[c]) ||
        (currentGameState[b] === 'X' && !currentGameState[a] && !currentGameState[c]) ||
        (currentGameState[c] === 'X' && !currentGameState[a] && !currentGameState[b])
      ) {
        availableСombinationsX.push([a, b, c]);
      }
      if (
        (currentGameState[a] === 'O' && !currentGameState[b] && !currentGameState[c]) ||
        (currentGameState[b] === 'O' && !currentGameState[a] && !currentGameState[c]) ||
        (currentGameState[c] === 'O' && !currentGameState[a] && !currentGameState[b])
      ) {
        availableСombinationsO.push([a, b, c]);
      }
    }

    if (computerWinnerСombinations.length) {
      let random = computerWinnerСombinations[
        Math.floor(Math.random() * computerWinnerСombinations.length)
      ].filter((item) => !currentGameState[item]);
      random = random[Math.floor(Math.random() * random.length)];
      index = random;
    } else if (playerWinnerСombinations.length) {
      let random = playerWinnerСombinations[
        Math.floor(Math.random() * playerWinnerСombinations.length)
      ].filter((item) => !currentGameState[item]);
      random = random[Math.floor(Math.random() * random.length)];
      index = random;
    } else if (
      stepNumber > 1 &&
      (availableСombinationsX.length || availableСombinationsO.length)
    ) {
      let randomX = availableСombinationsX.length
        ? availableСombinationsX[
            Math.floor(Math.random() * availableСombinationsX.length)
          ].filter((item) => !currentGameState[item])
        : availableСombinationsO[
            Math.floor(Math.random() * availableСombinationsO.length)
          ].filter((item) => !currentGameState[item]);
      randomX = randomX[Math.floor(Math.random() * randomX.length)];
      index = randomX;
    } else {
      index = getIndexEasyLevel(currentGameState);
    }

    return index;
  }

  export function getIndexEasyLevel(currentGameState) {
    let emptySquares = [];
    currentGameState.forEach((element, index) => {
      if (!element) {
        emptySquares.push(index);
      }
    });
    const randomSquares =
      emptySquares[Math.floor(Math.random() * emptySquares.length)];

    return randomSquares
  }

  export function highlightScore(element) {
    element.classList.toggle(style.update);
    setTimeout(() => {
      element.classList.toggle(style.update);
    }, 500);
  }