import React from 'react';

import Game from '../components/Game';

export default class Round extends React.Component {
  constructor(props) {
    super(props);



    this.state = {
      expanded: false
    }
  }

  render() {
    return (
      <div id="round">
        <div className="row">
          <div className="col-sm-12 card border-light">
            <div className="card-header" onClick={() => this.setState({expanded: !this.state.expanded})}>
              {this.props.roundId == 0 ?
                <h6>Finale</h6>
                :
                <h6>1/{Math.pow(2, this.props.roundId)} Finale</h6>
              }
            </div>

            {this.state.expanded ?
              <div className="card-body row">
                {this.props.round.map((game, index) => (
                  <Game key={index} game={game}></Game>
                ))}
              </div>
              :
              ''
            }
          </div>
        </div>


        <style jsx>{`
          .card {
            padding: 0;
            margin-bottom: 15px;
            box-shadow: 0 2px 1px rgba(200,200,200,0.7);
          }
          .card-header {
            cursor: pointer;
          }
          .card-header h6 {
            margin-bottom: 0;
          }
          .card-body {
            padding-bottom: 10px;
          }
        `}</style>
      </div>
    );
  }
}
