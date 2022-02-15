import { Square } from '../square';
import style from './index.module.css';

export function Board({ onClick, squares }) {
  return (
    <div className={style.board}>
      {squares.map((item, index) => {
        function clickHandler() {
          onClick(index);
        }
        return <Square key={index} value={item} onClick={clickHandler} />;
      })}
    </div>
  );
}
