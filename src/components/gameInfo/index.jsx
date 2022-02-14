import { Navigation } from '../navigation';
import Score from '../score';
import Settings from '../settings';
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
  playerOne,
  setPlayerMarkXHandleClick,
  setPlayerMarkOHandleClick,
  isStart,
  getStartHandleClick,
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
      <Settings
        playerOne={playerOne}
        setPlayerMarkXHandleClick={setPlayerMarkXHandleClick}
        setPlayerMarkOHandleClick={setPlayerMarkOHandleClick}
        history={history}
        isStart={isStart}
        getStartHandleClick={getStartHandleClick}
        isComputerMode={isComputerMode}
      />
    </div>
  );
}
