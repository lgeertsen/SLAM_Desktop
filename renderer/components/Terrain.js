import React from 'react';

export default class Terrain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    }
  }

  render() {
    return (
      <div id="table">
        <div className="cupTable">
          <div className="terrain">
            <h6>Terrain</h6>
            <h2>{this.props.game.terrain}</h2>
          </div>
          <div className="round">
            <h4>1/{Math.pow(2, this.props.game.tour)}</h4>
            <h6>Finale</h6>
          </div>
          {this.props.game.referee ?
            <div className="referee">
              <h5>Referee</h5>
              {this.props.game.referee.name}
            </div>
            : ''
          }
        </div>

        <div className="teamsContainer">
          <div className="teams">
            <div className={this.state.selected == 1 ? "team1 selected" : "team1"} onClick={() => this.setState({selected: 1})}>
              {/* <h3>{this.props.game.team1.id+1}</h3> */}
              <h5>{this.props.game.joueur1.name()}</h5>
            </div>
            <div className="vs">
              <h1>VS
                {this.state.selected ?
                  <button className="btn btn-warning" onClick={() => {
                    this.props.finishGame(this.props.game, this.state.selected);
                    this.setState({selected: null});
                  }}>Validate</button>
                  :
                  <button className="btn btn-warning disabled">Validate</button>
                }
              </h1>
            </div>
            <div className={this.state.selected == 2 ? "team2 selected" : "team2"} onClick={() => this.setState({selected: 2})}>
              {/* <h3>{this.props.game.team2.id+1}</h3> */}
              <h5>{this.props.game.joueur2.name()}</h5>
            </div>
          </div>
          <div className="score">
            <button className="btn btn-outline-dark" onClick={() => this.props.addPoint(this.props.game, 1)}>1</button>
            <button className="btn btn-outline-dark" onClick={() => this.props.addPoint(this.props.game, 2)}>2</button>
            <div className="sets">
              {this.props.game.sets.map((set, index) => (
                <div key={index} className="set">
                  <div className="setJ1">{set.score[0]}</div>
                  <div className="setJ2">{set.score[1]}</div>
                </div>
              ))}
            </div>
            <div className="games">
              <div className="game gameJ1">{this.props.game.score[0]}</div>
              <div className="game">{this.props.game.score[1]}</div>
            </div>
          </div>
        </div>


        <style jsx>{`
          div {
            height: auto;
          }
          #table {
            width: 100%;
            display: flex;
            align-items: center;
          }
          #table div {
            /* display: inline-block; */
            text-align: center;
          }
          .cupTable {
            width: 10%;
          }
          .teamsContainer {
            border-left: 1px solid rgba(0,0,0,.125);
            width: 90%;
          }
          .teams,
          .score {
            padding: 10px;
            display: inline-block;
            width: 50%;
          }
          .teams div {
            /* display: block; */
          }
          .team1,
          .team2 {
            /* width: 40%; */
            margin: 0 2.5%;
            padding: 8px;
            border: 1px solid rgba(0,0,0,.125);
            border-radius: 3px;
            cursor: pointer;
          }
          .vs {
            /* width: 10%; */
          }
          .vs h1 {
            /* font-size: 2em; */
          }
          .selected {
            border: 1px solid #28a745;
          }
          .sets,
          .games {
            display: inline-block;
          }
          .sets {
            border: 2px solid black;
            border-right-width: 1px;
          }
          .set {
            border-right: 1px solid black;
            display: inline-block;
          }
          .set > div {
            padding: 5px 8px;
          }
          .setJ1,
          .gameJ1 {
            border-bottom: 1px solid black;
          }
          .games {
            border: 2px solid black;
            border-left: none;
          }
          .game {
            padding: 5px 15px;
          }
          `}</style>
        </div>
      );
    }
  }
