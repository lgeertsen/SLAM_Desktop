import React from 'react';

import Sidebar from '../components/Sidebar';
import TeamList from '../components/TeamList';

export default class TournamentSetup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <div id="tournamentContainer">
        <div id="tournament">
          {this.props.tournament != undefined ?
            <div>
              <h1>Selected Tournament</h1>
              <h2>{this.props.tournament.sport} tournament</h2>
              <h4>Date: {this.props.tournament.date}</h4>
              <h4>Teams:</h4>
              <TeamList teams={this.props.teams} teamPresent={(index) => this.props.teamPresent(index)}/>
            </div>
            :
            ""
          }
        </div>

        <Sidebar
          nbTerrain={this.props.nbTerrain}
          changeTerrain={(e) => this.props.changeTerrain(e)}
          referees={this.props.referees}
          start={() => this.props.start()}
          allPresent={() => this.props.allPresent()}
          loadTeams={() => this.props.loadTeams()}
          saveTeams={() => this.props.saveTeams()}
        />


        <style jsx>{`
          #tournamentContainer {
            height: 100%;
            display: flex;
          }
          #tournament {
            flex: 1;
            height: 100%;
            overflow: auto;
          }
          `}</style>
        </div>
      );
    }
  }
