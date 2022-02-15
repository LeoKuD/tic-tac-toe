import style from './index.module.css'

export function Square({ onClick, value}) {
    return (
      <button className={style.square} onClick={onClick}>
        {value}
      </button>
    );
  }