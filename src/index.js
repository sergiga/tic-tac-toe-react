import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  return (
    <button className="square" style={props.style} onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  squareStyle(selected, winner) {
    let style = { color: '#9E9E9E' }

    if(selected) {
      style.color = '#212121'
    }
    if(winner) {
      style.color = '#00E676'
    }

    return style
  }

  renderRow(i) {
    return (
      <div key={i} className="board-row">
        {
          Array(3).fill(i).map((r, i1) => {
            return this.renderSquare(r * 3 + i1)    
          })
        }
      </div>
    )  
  }

  renderSquare(i) {
    const selected = this.props.selected === i
    const winner = this.props.winner && this.props.winner.some(w => w === i)

    return (
      <Square
        key = { i }
        value = { this.props.squares[i] }
        style = { this.squareStyle(selected, winner) }
        onClick = { () => this.props.onClick(i) } 
      />
    )
  }

  render() {
    return (
      <div>
        {
          Array(3).fill(null).map((r, i1) => {
            return this.renderRow(i1)  
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super()
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        highlighted: Array(3).fill(null),
        selected: null
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    
    if (calculateWinnerRow(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        selected: i
      }]),
      moveOrderAsc: true,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true
    })
  }

  toggleSortBtn() {
    this.setState({
      moveOrderAsc: !this.state.moveOrderAsc
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinnerRow(current.squares)

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const orderedMoves = this.state.moveOrderAsc
      ? history.slice() : history.slice().reverse()

    const moves = orderedMoves.map((step, move) => {
      const gameStartIndex = this.state.moveOrderAsc
        ? 0 : this.state.history.length - 1

      const desc = move === gameStartIndex
        ? 'Game Start'
        : 'Move: ' 
          + step.squares[step.selected] 
          + ' on (' 
          + Math.trunc(step.selected / 3) 
          + ', ' 
          + Math.trunc(step.selected % 3) 
          + ')'

        return (
          <li key = { move } >
            <a href="#" onClick = { () => this.jumpTo(move) }>{ desc }</a>
          </li>
        )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = { current.squares }
            selected = { current.selected }
            winner = { winner }
            onClick = { (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick = { () => this.toggleSortBtn() }>Reverse</button>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

function calculateWinnerRow(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
