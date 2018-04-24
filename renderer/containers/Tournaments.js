import React from 'react';
//import ReactTable from 'react-table'
// import axios from 'axios';
import electron from 'electron';
import fs from 'fs';

const io = require('socket.io-client');

import TitleBar from '../containers/TitleBar';
import TournamentContainer from '../containers/TournamentContainer';
import TournamentListContainer from '../containers/TournamentListContainer';
import TournamentSetup from '../containers/TournamentSetup';

import Loading from '../components/Loading';
import Login from '../components/Login';

import Api from '../classes/Api';
// import Match from '../classes/Match';
import Tournament from '../classes/Tournament';

var socket;
var api = new Api();
var tournament = new Tournament();

export default class Tournaments extends React.Component {
  constructor(props) {
    super(props);

    this.remote = electron.remote || false;
    this.ipcRenderer = electron.ipcRenderer || false;
    this.dialog = this.remote.dialog || false;

    this.state = {
      started: false,
      finished: false,
      activeTab: 1,
      tournamentsLoaded: false,
      selected: 0,
      tournament: undefined,
      validated: false,
      teamsLoaded: false,
      matchsSuivants:[],
      tournaments: [],
      teams: [],
      players: [],
      tree: [],
      matchs: [],
      history: [],
      referees: [],
      terrains: [],
      ranking: [],
      nbTerrain: 1,
      username: '',
      password: '',
      accessToken: '',
      authenticated: true,
      sending: false
    }
  }

  componentDidMount() {
    socket = io('https://lets-go-server.herokuapp.com', {
      transports: ['websocket'],
    });

    this.loadTournaments();

    socket.on('connected', () => {
      console.log("connected to server");
      tournament.socket = socket;
      // this.setState({ isConnected: true });
    });

    socket.on('addPoint', (data) => {
      console.log("add point");
      console.log(data);
      let match = this.state.tree[data.tour][data.id];
      this.addPoint(match, data.joueur);
      // this.setState({ isConnected: true });
    });

    socket.on('joinTournament', data => {
      console.log(data);
      console.log("a referee joined: " + data.name);
      let refs = this.state.referees;
      refs.push(data);
      this.setState({referees: refs});
    });
  }

  login() {
    api.login(this.state.username, this.state.password, data => this.setState(data));
  }

  loadTournaments() {
    api.loadTournaments(this.state.accessToken, data => this.setState(data));
  }

  loadTournament() {
    api.loadTournament(this.state.selected, this.state.accessToken, socket, data => {
      this.setState(data);
      this.ipcRenderer.send('tournament', data.tournament);
    });
  }

  sendResults() {
    api.sendResults(this.state.tournament.id, this.state.accessToken, this.state.ranking);
    this.setState({sending: true});
    setTimeout(() => {
      this.setState({sending: false});
    }, 2000);
  }

  selectTournament(id) {
    this.setState({selected: id});
  }

  teamPresent(index) {
    let teams = this.state.teams;
    let p = teams[index].present;
    teams[index].present = !p;
    this.setState({'teams': teams})
  }

  start() {
    let participantpres = [];

    for(let i in this.state.teams) {
      if(this.state.teams[i].present) {
        participantpres.push(this.state.teams[i]);
      }
    }

    if(participantpres.length > 1) {
      this.setState({started: true, players: participantpres})
      tournament.teams = participantpres;
      // //////////////CREATION DU TABLEAU ET REMPLISSAGE AVEC DES MATCHS VIDES/////////////////////
      tournament.createTree(participantpres.length-1, tree => this.setState(tree));
      ///////////////REMPLISSAGE DU TABLEAU AVEC DES EQUIPES/////////////
      tournament.fillTree(participantpres, tree => this.setState(tree));
      console.log(this.state.tree);

      tournament.assignTerrain(this.state.nbTerrain, this.state.referees, terrains => this.setState(terrains));
    }
  }

  addPoint(game, id) {
    let result = tournament.addPoint(game, id, (data, result) => {
      this.setState(data)
      if(result != null) {
        this.finishGame(game, id);
      }
    });
  }

  finishGame(game, winner) {
    tournament.finishGame(game, winner, (tree, tables, history, finished) => {
      this.setState({tree: tree, tables: tables, history: history, finished: finished});
      if(finished) {
        tournament.createRanking((data) => {
          this.setState(data);
        });
      }
    });
  }

  allPresent() {
    let teams = this.state.teams;
    for(let i = 0; i < teams.length; i++) {
      teams[i].present = true;
    }
    this.setState({teams: teams});
  }

  reset() {
    tournament.reset();
    this.setState({
      started: false,
      finished: false,
      activeTab: 1,

      tournaments: [],

      matchs: [],
      players: [],
      tree: [],
      matchs: [],
      history: [],
      terrains: [],
      referees: [],
      ranking: [],

      username: '',
      password: '',
      accessToken: '',
      authenticated: true,
      sending: false
    });
    this.loadTournament();
  }



  render() {
    return (
      <div id="tournaments">
        <TitleBar
          started={this.state.started}
          finished={this.state.finished}
          activeTab={this.state.activeTab}
          switchTab={value => this.setState({activeTab: value})}
        />

        <div id="container">
          <button id="reset" className="btn btn-outline-dark btn-sm" onClick={() => this.reset()}>reset</button>
          {this.state.authenticated ? "" :
          <Login username={this.state.username} usernameChange={(e) => this.setState({'username': e.target.value})} password={this.state.password} passwordChange={(e) => this.setState({'password': e.target.value})} login={() => this.login()} />
        }
        { this.state.tournament == undefined ?
          <div id="tournamentSelectContainer">
            {this.state.tournamentsLoaded == true ?
              <TournamentListContainer tournaments={this.state.tournaments} loadTournament={(id) => this.loadTournament(id)} loadTournaments={(id) => this.loadTournaments(id)} selected={this.state.selected} selectTournament={(id) => this.selectTournament(id)} />
              :
              <Loading text="Loading Tournaments"/>
            }
          </div>
          :
          <div id="teamsContainer">
            <div id="teams">
              { this.state.started == true ?
                <TournamentContainer
                  finished={this.state.finished}
                  activeTab={this.state.activeTab}
                  tree={this.state.tree}
                  terrains={this.state.terrains}
                  finishGame={(game, winner) => this.finishGame(game, winner)}
                  addPoint={(game, id) => this.addPoint(game, id)}
                  ranking={this.state.ranking}
                  sendResults={() => this.sendResults()}
                  sending={this.state.sending}
                />
                :
                <TournamentSetup
                  tournament={this.state.tournament}
                  teams={this.state.teams}
                  teamPresent={(index) => this.teamPresent(index)}
                  nbTerrain={this.state.nbTerrain}
                  changeTerrain={e => this.setState({'nbTerrain': e.target.value})}
                  start={() => this.start()}
                  referees={this.state.referees}
                  allPresent={() => this.allPresent()}
                />

              }

            </div>
          </div>
        }
      </div>


      <style jsx>{`
        #tournaments {
          /* display: flex; */
          /* height: calc(100vh - 30px); */
          height: 100%;
          width: 100%;
        }
        #tournaments div {
          display: inline-block;
        }
        #container {
          height: calc(100vh - 30px);
          width: 100%;
          display: flex;
        }
        #reset {
          position: fixed;
          bottom: 0;
          left: 0;
          z-index: 1000;
        }
        #tournamentSelectContainer {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
        }
        #teamsContainer {
          width: 100%;
          height: 100%;
          display: flex;
        }
        #teams {
          width: 100%;
          height: 100%;
          display: flex;
        }
        #start {
          position: absolute;
          bottom: 10px;
          right: 5%;
          width: 90%;
        }
        `}</style>
      </div>
    );
  }
}
