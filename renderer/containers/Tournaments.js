import React from 'react';
//import ReactTable from 'react-table'
// import axios from 'axios';
import querystring from 'querystring';
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
      nbTerrain: 1,
      username: '',
      password: '',
      accessToken: '',
      authenticated: true
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
    api.loadTournament(this.state.selected, this.state.accessToken, socket, data => this.setState(data));
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
      tournament.createTree(participantpres.length, tree => this.setState(tree));
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
    tournament.finishGame(game, winner, (tree, tables, history) => this.setState({tree: tree, tables: tables, history: history}));
  }


  arbre2(){
    // let participantpres = [];
    //
    // for(let i in this.state.teams) {
    //   if(this.state.teams[i].present) {
    //     participantpres.push(this.state.teams[i]);
    //   }
    // }
    //
    // let nbJoueur = participantpres.length;
    // let nbTour = 1;
    //
    // while(Math.pow(2, nbTour) < nbJoueur) {
    //   nbTour++;
    // }
    //
    // let nbDuel = (nbJoueur - (Math.pow(2, nbTour) - nbJoueur)) / 2;
    // let i = 0;
    // let arbre = [];
    // let nbDuels = nbJoueur-1;
    //
    // //////////////CREATION DU TABLEAU ET REMPLISSAGE AVEC DES MATCHS VIDES/////////////////////
    // while(i != nbTour) {
    //   arbre[i] = [];
    //   let nbmatchs = Math.pow(2, i);
    //   for(let t=0 ; t < nbmatchs; t++) {
    //     if(nbDuels > 0) {
    //       arbre[i][t] = new Match(i,t, null, null);
    //       nbDuels--;
    //     }
    //   }
    //   i++;
    // }
    //
    // i--;

    ///////////////REMPLISSAGE DU TABLEAU AVEC DES EQUIPES/////////////
    // while(nbJoueur > 0){
    //   for(var t = arbre[i].length-1; t >= 0; t--) {
    //     if(nbJoueur == 1){
    //       let n=Math.floor(Math.random() * Math.floor(participantpres.length));
    //       let joueur=participantpres[n];
    //       participantpres.splice(n,1);
    //       arbre[i][t]=new Match(i,t,null,joueur);
    //       nbJoueur--;
    //     }else {
    //       let n1=Math.floor(Math.random() * Math.floor(participantpres.length));
    //       let joueur1=participantpres[n1];
    //       participantpres.splice(n1,1);
    //       let n2=Math.floor(Math.random() * Math.floor(participantpres.length));
    //       let joueur2=participantpres[n2];
    //       participantpres.splice(n2,1);
    //       arbre[i][t]=new Match(i,t,joueur1,joueur2);
    //       nbJoueur--;
    //       nbJoueur--;
    //     }
    //   }
    //   i--;
    // }
    /////////////////AFFICHAGE//////////////
    // console.table(tournoi);
    // for (var k = 0; k < tournoi.length; k++) {
    //   for (var j = 0; j < tournoi[k].length; j++) {
    //     console.log("match",j+1);
    //     if (tournoi[k][j].j1 !=null) {
    //       console.log(tournoi[k][j].j1.name);
    //     }else {
    //       console.log("j1 null");
    //     }
    //     if (tournoi[k][j].j2 !=null) {
    //       console.log(tournoi[k][j].j2.name);
    //     }else {
    //       console.log("j2 null");
    //     }
    //   }
    //
    // }

    this.setState({started: true, teamsLoaded: true, matchs: arbre});
    for (var r = 0; r < arbre.length; r++) {
      for (var j = 0; j < arbre[r].length; j++) {

        if(arbre[r][j].j1!=null ||arbre[r][j].j2!=null){
          this.state.matchsSuivants.push(arbre[r][j]);
        }
      }
    }
  }

  matchsAffichage(){
    let k=0;
    let Suivants=[];

    for (var i = 0; i < this.state.matchs.length; i++) {
      for (var j = 0; j < this.state.matchs[i].length; j++) {
        if(this.state.matchs[i][j]!=null){
          if (this.state.matchs[i][j].j1!=null || this.state.matchs[i][j].j2!=null) {
            if(this.state.matchs[i][j].res1==null){
              Suivants.push(this.state.matchs[i][j]);
              k++;
            }
          }
        }
      }
    }
    // for (var v in this.state.matchsSuivants) {
    //   if(v.j1!=null){
    //
    //     console.log(v.j1.name);
    //   }else {
    //     console.log("null j1");
    //   }
    //
    //     if(v.j2!=null){
    //
    //       console.log(v.j2.name);
    //     }else {
    //       console.log("null j2");
    //     }
    //
    // }
    console.log("matchsSuivants");

    this.setState({matchsSuivants:Suivants});
    console.table(this.state.matchsSuivants);
  }

  jeu(id,tour,joueur){
    // console.log(id);
    // console.log(tour);
    // console.log(joueur);
    //console.log(this.state.matchs);
    // console.log(id);
    // console.log(tour);
    // console.log(id-1);
    // console.log(tour/2);
    if(joueur==1){
      this.state.matchs[id][tour].res1=1;
      this.state.matchs[id][tour].res2=0;

      if(this.state.matchs[id-1][Math.trunc(tour/2)].j1!=null){
        this.state.matchs[id-1][Math.trunc(tour/2)].j2=this.state.matchs[id][tour].j1;
      }
      else {
        this.state.matchs[id-1][Math.trunc(tour/2)].j1=this.state.matchs[id][tour].j1;
      }
    }else {
      this.state.matchs[id][tour].res2=1;
      this.state.matchs[id][tour].res1=0;
      if(this.state.matchs[id-1][Math.trunc(tour/2)].j1!=null){
        this.state.matchs[id-1][Math.trunc(tour/2)].j2=this.state.matchs[id][tour].j2;
      }
      else {
        this.state.matchs[id-1][Math.trunc(tour/2)].j1=this.state.matchs[id][tour].j2;
      }
    }

    //remplir le tableau avec les matchs un seul joueur (premier tour)

    let matchs = this.state.matchs;
    console.table(matchs);
    this.matchsAffichage();
    /////////////////AFFICHAGE//////////////

    for (var k = 0; k < matchs.length; k++) {
      for (var j = 0; j < matchs[k].length; j++) {
        console.log("match",j+1);
        if (matchs[k][j].j1 !=null) {
          console.log(matchs[k][j].j1.name);
          console.log(matchs[k][j].res1);
        }else {
          console.log("j1 null");
        }
        if (matchs[k][j].j2 !=null) {
          console.log(matchs[k][j].j2.name);
          console.log(matchs[k][j].res2);
        }else {
          console.log("j2 null");
        }
      }
    }

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
      activeTab: 1,

      tournaments: [],

      matchs: [],
      players: [],
      tree: [],
      matchs: [],
      history: [],
      terrains: [],
      referees: [],

      username: '',
      password: '',
      accessToken: '',
      authenticated: true
    });
    this.loadTournament();
  }



  render() {
    return (
      <div id="tournaments">
        <TitleBar
          started={this.state.started}
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
                  activeTab={this.state.activeTab}
                  tree={this.state.tree}
                  terrains={this.state.terrains}
                  finishGame={(game, winner) => this.finishGame(game, winner)}
                  addPoint={(game, id) => this.addPoint(game, id)}
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
