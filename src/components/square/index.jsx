export function Square({ onClick, value, index }) {
    return (
      <button data-index={index} className="square" onClick={onClick}>
        {value}
      </button>
    );
  }