import React from 'react';
import { PLAYERSKEYS } from '../../constants';
import style from './index.module.css';

class Score extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.score.x < this.props.score.x) {
      const x = document.getElementById('x');
      x.classList.toggle(style.update);
      setTimeout(() => {
        x.classList.toggle(style.update);
      }, 500);
    }
    if (prevProps.score.o < this.props.score.o) {
      const o = document.getElementById('o');
      o.classList.toggle(style.update);
      setTimeout(() => {
        o.classList.toggle(style.update);
      }, 500);
    }
    if (prevProps.score.tie < this.props.score.tie) {
      const tie = document.getElementById('tie');
      tie.classList.toggle(style.update);
      setTimeout(() => {
        tie.classList.toggle(style.update);
      }, 500);
    }
  }
  render() {
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
