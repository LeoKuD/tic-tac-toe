import { Navigation } from '../navigation';
import Score from '../score';
import style from './index.module.css';

export function GameInfo({
  score,
  isComputerMode,
  resetGameHandleClick,
  stepNumber,
  jumpToBackHandleClick,
  history,
  jumpToNextHandleClick,
  modeHandlerClick,
}) {
  return (
    <div className={style.gameInfo}>
      <Score score={score} isComputerMode={isComputerMode} />
      <Navigation
        resetGameHandleClick={resetGameHandleClick}
        jumpToBackHandleClick={jumpToBackHandleClick}
        stepNumber={stepNumber}
        history={history}
        jumpToNextHandleClick={jumpToNextHandleClick}
        isComputerMode={isComputerMode}
        modeHandlerClick={modeHandlerClick}
      />
    </div>
  );
}
