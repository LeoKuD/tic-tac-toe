import React from 'react';
import style from './index.module.css';

class Settings extends React.Component {
  render() {
    return (
      <div className={style.settingsMenu}>
        <button className={style.settings__button} type="submit" onClick={this.props.getStartHandleClick}>Settings</button>
        <div
          className={this.props.isStart ? style.settings_hide : style.settings}
        >
          <p>
          Who is first?
          </p>
          <div className={style.settings__elements}>
            <div>
              <label htmlFor="x">
                {this.props.isComputerMode ? `Computer (X)` : `Player (X)`}
              </label>
              <input
                defaultChecked={this.props.playerOne}
                type="radio"
                name="playerMark"
                id="x"
                onClick={this.props.setPlayerMarkXHandleClick}
              />
            </div>

            <div>
              <label htmlFor="o">Player (O)</label>
              <input
                defaultChecked={!this.props.playerOne}
                type="radio"
                name="playerMark"
                id="o"
                onClick={this.props.setPlayerMarkOHandleClick}
              />
            </div>
          </div>
          <p>
          Level of difficulty:
          </p>
          <div className={style.settings__elements}>
            <div>
              <label htmlFor="x">
              Easy
              </label>
              <input
              defaultChecked={!this.props.isLevelHard}
                type="radio"
                name="level"
                id="easy"
                onClick={this.props.changeLavelHandleClick}
              />
            </div>

            <div>
              <label htmlFor="o">Hard</label>
              <input
              defaultChecked={this.props.isLevelHard}

                type="radio"
                name="level"
                id="hard"
                onClick={this.props.changeLavelHandleClick}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
