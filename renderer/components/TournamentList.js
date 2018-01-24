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
        <ul>
          {this.props.tournaments.map(tournament => (
            <li key={tournament.id}>
              <h4>{tournament.sport} tournament</h4>
              <h6>Date: {tournament.date}</h6>
              <button className="btn" onClick={() => this.props.loadTournament(tournament.id)}>Load Tournament</button>
            </li>
          ))}
        </ul>


        <style jsx>{`

        `}</style>
      </div>
    );
  }
}
