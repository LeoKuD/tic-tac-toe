import React from 'react';
import style from './index.module.css';

class Settings extends React.Component {
  render() {
    return (
      <div
        className={this.props.isStart ? style.settings_hide : style.settings}
      >
        <p>
          {this.props.isComputerMode
            ? `Кто играет первым?`
            : `Выбери кем играет первый игрок:`}
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
          <button type="submit" onClick={this.props.getStartHandleClick}>
            Save
          </button>
        </div>
      </div>
    );
  }
}

export default Settings;
