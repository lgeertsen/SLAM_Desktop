import React from 'react';
import axios from 'axios';

import TournamentList from '../components/TournamentList';

export default class Tournaments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'tournament': undefined,
      'tournaments': []
    }
  }

  loadTournaments() {
    axios.get('https://infinite-atoll-48235.herokuapp.com/api/tournaments')
      .then((response) => {
        console.log(response.data.data);
        this.setState({'tournaments': response.data.data});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  loadTournament(id) {
    let url = 'https://infinite-atoll-48235.herokuapp.com/api/tournaments/' + id;
    axios.get(url)
      .then((response) => {
        console.log(response.data);
        this.setState({'tournament': response.data});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div id="tournaments">
        <button className="btn btn-warning" onClick={() => this.loadTournaments()}>Load Tournaments</button>

        <TournamentList tournaments={this.state.tournaments} loadTournament={(id) => this.loadTournament(id)}/>

        {this.state.tournament != undefined ?
          <div>
            <h1>Selected Tournament</h1>
            <h2>{this.state.tournament.sport} tournament</h2>
            <h4>Date: {this.state.tournament.date}</h4>
            <h4>Participants:</h4>
            <ul>
              {this.state.tournament.participants.map(participant => (
                <li key={participant.id}>
                  <h6>{participant.user.name}</h6>
                </li>
              ))}
            </ul>
          </div>
          :
          ""
        }


        <style jsx>{`

        `}</style>
      </div>
    );
  }
}
