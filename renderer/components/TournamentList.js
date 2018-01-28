import React from 'react';

export default class TournamentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <div id="tournamentList">
        <ul className="list-group">
          {this.props.tournaments.map(tournament => (
            <li className="list-group-item" key={tournament.id}>
              <h5>{tournament.sport} tournament</h5>
              <h6>{tournament.date}</h6>
              <button className="btn btn-info btn-sm" onClick={() => this.props.loadTournament(tournament.id)}>Load Tournament</button>
            </li>
          ))}
        </ul>


        <style jsx>{`
          #tournamentList {
            margin: 10px 0;
            text-align: left;
            height: 50%;
          }
          .list-group {
            height: 100%;
            overflow-y: auto;
          }
          button {
            float: right;
          }
        `}</style>
      </div>
    );
  }
}
