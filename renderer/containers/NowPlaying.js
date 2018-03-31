import React from 'react';

import Terrain from '../components/Terrain';

export default class NowPlaying extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div id="nowPlaying">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 card">
              <ul className="list-group list-group-flush">
                {this.props.terrains.map((game, index) => (
                  <li key={index} className="list-group-item">
                    <Terrain
                      game={game}
                      index={index}
                      finishGame={(game, winner) => this.props.finishGame(game, winner)}
                    />
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>


        <style jsx>{`
          div {
            height: auto;
          }
          #nowPlaying {
            height: 100%;
          }
          .container {
            padding-top: 20px;
            height: 100%;
          }
          .row {
          }
          .card {
            padding: 0;
            margin-bottom: 25px;
          }
          .list-group {
            height: auto;
          }
          .list-group-item {
            padding: 0;
            display: flex;
            align-items: center;
          }
          `}</style>
        </div>
      );
    }
  }
