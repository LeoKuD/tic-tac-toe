import { GAME_KEYS, LINES } from './constants';
import style from './components/score/index.module.css';

export function initialState() {
  return {
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
  };
}

export function initialStaticVariables() {
  return {
    x: 0,
    o: 0,
    tie: 0,
    roundCompleted: false,
  };
}

export function calculateWinner(squares) {
  const countSteps = squares.filter((item) => item);

  for (let i = 0; i < LINES.length; i++) {
    const [a, b, c] = LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (countSteps.length === 9) {
    return GAME_KEYS.tie;
  }
  return null;
}

export function getIndexHardLevel(currentGameState, stepNumber) {
  let availableСombinationsX = [];
  let availableСombinationsO = [];
  let computerWinnerСombinations = [];
  let playerWinnerСombinations = [];

  function checkPlayerWinnerCombitation(player, [a, b, c]) {
    if (
      (currentGameState[a] === player &&
        currentGameState[b] === player &&
        !currentGameState[c]) ||
      (currentGameState[a] === player &&
        currentGameState[c] === player &&
        !currentGameState[b]) ||
      (currentGameState[b] === player &&
        currentGameState[c] === player &&
        !currentGameState[a])
    ) {
      return [a, b, c];
    }
  }

  function checkAvailableСombinations(player, [a, b, c]) {
    if (
      (currentGameState[a] === player &&
        !currentGameState[b] &&
        !currentGameState[c]) ||
      (currentGameState[b] === player &&
        !currentGameState[a] &&
        !currentGameState[c]) ||
      (currentGameState[c] === player &&
        !currentGameState[a] &&
        !currentGameState[b])
    ) {
      return [a, b, c];
    }
  }

  for (let i = 0; i < LINES.length; i++) {
    const [a, b, c] = LINES[i];
    if (checkPlayerWinnerCombitation(GAME_KEYS.o, [a, b, c])) {
      playerWinnerСombinations.push(
        checkPlayerWinnerCombitation(GAME_KEYS.o, [a, b, c])
      );
    }
    if (checkPlayerWinnerCombitation(GAME_KEYS.x, [a, b, c])) {
      computerWinnerСombinations.push(
        checkPlayerWinnerCombitation(GAME_KEYS.x, [a, b, c])
      );
    }
    if (checkAvailableСombinations(GAME_KEYS.x, [a, b, c])) {
      availableСombinationsX.push(
        checkAvailableСombinations(GAME_KEYS.x, [a, b, c])
      );
    }
    if (checkAvailableСombinations(GAME_KEYS.o, [a, b, c])) {
      availableСombinationsO.push(
        checkAvailableСombinations(GAME_KEYS.o, [a, b, c])
      );
    }
  }

  if (computerWinnerСombinations.length) {
    return getRandomIndex(computerWinnerСombinations, currentGameState);
  } else if (playerWinnerСombinations.length) {
    return getRandomIndex(playerWinnerСombinations, currentGameState);
  } else if (
    stepNumber > 1 &&
    (availableСombinationsX.length || availableСombinationsO.length)
  ) {
    return availableСombinationsX.length
      ? getRandomIndex(availableСombinationsX, currentGameState)
      : getRandomIndex(availableСombinationsO, currentGameState);
  } else {
    return getIndexEasyLevel(currentGameState);
  }
}

function getRandomIndex(combinations, currentGameState) {
  let randomLine = calculateRandomIndex(combinations).filter(
    (item) => !currentGameState[item]
  );

  return calculateRandomIndex(randomLine);
}

export function getIndexEasyLevel(currentGameState) {
  let emptySquares = currentGameState
    .map((item, index) => (item ? null : index))
    .filter((item) => item !== null);
  return calculateRandomIndex(emptySquares);
}

function calculateRandomIndex(elements) {
  return elements[Math.floor(Math.random() * elements.length)];
}

export function highlightScore(element) {
  element.classList.toggle(style.update);
  setTimeout(() => {
    element.classList.toggle(style.update);
  }, 500);
}
