import { Square } from "../square";

export function Board({ onClick, squares }) {
    function renderSquare(i) {
      function handlerClick() {
        onClick(i);
      }
      return <Square index={i} value={squares[i]} onClick={handlerClick} />;
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