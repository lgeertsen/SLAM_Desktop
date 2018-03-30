import React from 'react';

import TournamentList from '../components/TournamentList';

export default class TournamentListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <div id="tournamentSelect">
        <div className="title">
          <h1>Tournaments</h1>
        </div>
        <div id="tournamentList">
          <TournamentList
            tournaments={this.props.tournaments}
            // loadTournament={(id) => this.loadTournament(id)}
            selected={this.props.selected}
            selectTournament={(id) => this.props.selectTournament(id)}
          />
        </div>
        <div className="bottom">
          <button className="btn btn-warning" onClick={() => this.props.loadTournaments()}>Load Tournaments</button>
          <button className="btn btn-success" onClick={() => this.props.loadTournament()}>Confirm & Load Tournament</button>
        </div>


        <style jsx>{`
          #tournamentSelect {
            height: 100%;
            flex: 1;
            /* margin: 40px; */
            width: 100%;
            /* height: 20vh; */
            /* background: green; */
            display: flex;
            flex-direction: column;
          }
          #tournamentSelect .title {
            text-align: center;
            margin-top: 5px;
          }
          #tournamentSelect #tournamentList {
            flex: 1;
            overflow-y: auto;
            /* padding: 0 20px; */
            margin: 5px 0;
          }
          #tournamentSelect .bottom {
            margin: 10px 0;
            text-align: center;
          }
          `}</style>
        </div>
      );
    }
  }
