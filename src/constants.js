export const GAME_KEYS = {
    x: 'X',
    o: 'O',
    tie: 'tie',
}

export const PLAYER_KEYS = {
    computerX: 'Computer X',
    playerO: 'Player O',
    playerX: 'Player X',
}

export const MODE = {
    computer: 'Computer',
    players: 'Players'
}

export const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  export const STATUS = {
    nextPlayer: 'Next player:'
  }

  export const SELECTORS_KEYS = {
    game: 'game',
    status: 'status',
    gameBoard: 'game-board',
    blocked: 'blocked'
  }

  export const NAVIGATION_KEYS = {
    back: 'back',
    next: 'next',
  }

  export const LOCALSTORAGE_KEYS = {
    state: 'state',
    score: 'score',
  }