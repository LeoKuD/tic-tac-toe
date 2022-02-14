import React from 'react';
import { PLAYERSKEYS } from '../../constants';
import style from './index.module.css';

class Score extends React.Component {
  constructor(props) {
    super(props);
    this.scoreX = 0;
    this.scoreO = 0;
    this.scoreTie = 0;
  }

  updateScore() {
    if (this.scoreX < this.props.score.x) {
      const x = document.getElementById('x');
      x.classList.toggle(style.update);
      setTimeout(() => {
        x.classList.toggle(style.update);
      }, 500);
    }
    if (this.scoreO < this.props.score.o) {
      const o = document.getElementById('o');
      o.classList.toggle(style.update);
      setTimeout(() => {
        o.classList.toggle(style.update);
      }, 500);
    }
    if (this.scoreTie < this.props.score.tie) {
      const tie = document.getElementById('tie');
      tie.classList.toggle(style.update);
      setTimeout(() => {
        tie.classList.toggle(style.update);
      }, 500);
    }

    this.scoreX = this.props.score.x;
    this.scoreO = this.props.score.o;
    this.scoreTie = this.props.score.tie;
  }
  render() {
    this.updateScore();
    return (
      <div className={style.score}>
        <p id="x">
          {(this.props.isComputerMode
            ? PLAYERSKEYS.computerX
            : PLAYERSKEYS.playerX) + `: ${this.props.score.x}`}
        </p>
        <p id="tie">tie: {this.props.score.tie}</p>
        <p id="o">{`${PLAYERSKEYS.playerO}: ${this.props.score.o}`}</p>
      </div>
    );
  }
}

export default Score;
