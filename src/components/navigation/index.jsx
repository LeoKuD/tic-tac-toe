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
  const isNextStep = stepNumber + 1 < history.length;
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
        disabled={!stepNumber}
        onClick={jumpToBackHandleClick}
      >
        'Back'
      </button>
      <button
        className={isNextStep ? '' : style.disabled}
        disabled={!isNextStep}
        onClick={jumpToNextHandleClick}
      >
        'Next'
      </button>
    </div>
  );
}
