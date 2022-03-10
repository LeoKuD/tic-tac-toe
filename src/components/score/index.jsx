import React from 'react';
import { PLAYER_KEYS } from '../../constants';
import { highlightScore } from '../../helpers';
import style from './index.module.css';

class Score extends React.Component {
  constructor(props) {
    super(props);
    this.scoreX = this.props.score.x;
    this.scoreO = this.props.score.o;
    this.scoreTie = this.props.score.tie;
    this.refX = React.createRef();
    this.refO = React.createRef();
    this.refTie = React.createRef();
  }

  componentDidUpdate() {
    this.updateScore();
  }
  updateScore() {
    if (this.scoreX < this.props.score.x) {
      highlightScore(this.refX.current);
    }
    if (this.scoreO < this.props.score.o) {
      highlightScore(this.refO.current);
    }
    if (this.scoreTie < this.props.score.tie) {
      highlightScore(this.refTie.current);
    }

    this.scoreX = this.props.score.x;
    this.scoreO = this.props.score.o;
    this.scoreTie = this.props.score.tie;
  }
  render() {
    return (
      <div className={style.score}>
        <p ref={this.refX}>
          {(this.props.isComputerMode
            ? PLAYER_KEYS.computerX
            : PLAYER_KEYS.playerX) + `: ${this.props.score.x}`}
        </p>
        <p ref={this.refTie}>tie: {this.props.score.tie}</p>
        <p ref={this.refO}>{`${PLAYER_KEYS.playerO}: ${this.props.score.o}`}</p>
      </div>
    );
  }
}

export default Score;
