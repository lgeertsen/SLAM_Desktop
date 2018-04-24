import React from 'react';

export default class Ranking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div id="ranking">
        <div className="container">
          {this.props.sending ?
            <div className="progress">
              <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: 100 + '%'}}></div>
            </div>
          :
            <button className="btn btn-info" onClick={() => this.props.sendResults()}>Send results to server</button>
          }
          <ul className="list-group">
            <li className="list-group-item list-group-item-dark">
              <div className="rank">
                <h6>RANK</h6>
              </div>
              <div className="flex">
                <h5>PLAYER</h5>
              </div>
              <div className="elo">
                <h6>OLD ELO</h6>
              </div>
              <div className="elo">
                <h6>NEW ELO</h6>
              </div>
            </li>
            {this.props.ranking.map((player, index) => (
              <li className="list-group-item" key={index}>
                <div className="rank">
                  <h6>{player.rank}</h6>
                </div>
                <div className="flex">
                  <h5>{player.name()}</h5>
                </div>
                <div className="elo">
                  <span className="badge badge-danger badge-pill">{player.eloStart}</span>
                </div>
                <div className="elo">
                  <span className="badge badge-primary badge-pill">{player.elo}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <style jsx>{`
          .container {
            margin-top: 25px;
            margin-bottom: 25px;
          }
          .btn {
            width: 100%;
          }
          .list-group {
            margin-top: 15px;
          }
          .list-group-item {
            display: flex;
            align-items: center;
          }
          .list-group-item > div {
            display: inline-block;
            padding: 0 10px;
          }
          .rank {
            width: 15%;
          }
          .elo {
            width: 8%;
            text-align: center;
          }
          .flex {
            flex: 1;
          }
        `}</style>
      </div>
    );
  }
}
