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
        <Sidebar
          tournament={this.props.tournament}
          nbTerrain={this.props.nbTerrain}
          changeTerrain={(e) => this.props.changeTerrain(e)}
          referees={this.props.referees}
          start={() => this.props.start()}
          allPresent={() => this.props.allPresent()}
        />
        <div id="tournament">
          {this.props.tournament != undefined ?
            <div>
              <TeamList teams={this.props.teams} teamPresent={(index) => this.props.teamPresent(index)}/>
            </div>
            :
            ""
          }
        </div>


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
