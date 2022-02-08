import { MODE } from '../../constants';
import style from './index.module.css';

export function Navigation({
  resetGameHandleClick,
  jumpToBackHandleClick,
  stepNumber,
  history,
  jumpToNextHandleClick,
  modeHandlerClick,
  isComputerMode,
}) {
  return (
    <div className={style.navigation}>
      <div className={style.mode}>
        <button onClick={modeHandlerClick}>
          Mode: {isComputerMode ? MODE.computer : MODE.players}
        </button>
      </div>
      <button onClick={resetGameHandleClick}>'Reset'</button>
      <button
        className={stepNumber ? '' : style.disabled}
        disabled={stepNumber ? false : true}
        onClick={jumpToBackHandleClick}
      >
        'Back'
      </button>
      <button
        className={stepNumber + 1 < history.length ? '' : style.disabled}
        disabled={stepNumber + 1 < history.length ? false : true}
        onClick={jumpToNextHandleClick}
      >
        'Next'
      </button>
    </div>
  );
}
