import React from 'react';
//import ReactTable from 'react-table'
import axios from 'axios';
import querystring from 'querystring';

const io = require('socket.io-client');

import Login from '../components/Login';
import TournamentList from '../components/TournamentList';
import TeamList from '../components/TeamList';

var socket;


class Match{
  constructor(id,tour,joueur1,joueur2){
    this.id=id;
    this.tour=tour;
    this.j1=joueur1;
    this.j2=joueur2;
    this.res1=null;
    this.res2=null;

  }

  gagne(){return this.res1>this.res2;}//true si J1 gagne le match false sinon

}


export default class Tournaments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'tournamentsLoaded': false,
      'selected': 0,
      'tournament': undefined,
      'validated': false,
      'teamsLoaded': false,
      'matchsSuivants':[],
      'tournaments': [],
      'teams': [],
      'matchs': [],
      'referees': [],
      'nbTerrain': 1,
      'username': '',
      'password': '',
      'accessToken': '',
      'authenticated': true
    }
  }

  componentDidMount() {
    socket = io('https://lets-go-server.herokuapp.com', {
      transports: ['websocket'],
    });

    this.loadTournaments();

    socket.on('connected', () => {
      console.log("connected to server");
      // this.setState({ isConnected: true });
    });

    socket.on('joinTournament', data => {
      console.log("a referee joined: " + data.name);
      let refs = this.state.referees;
      refs.push(data.name);
      this.setState({referees: refs});
    });
  }

  login() {
    axios.post('https://lets-go2.herokuapp.com/oauth/token', querystring.stringify({
      // 'form_params': {
      'grant_type': 'password',
      'client_id': 1,
      'client_secret': 'DHDxY2KWlSq41JO8XkTNSieGuIvmztFbZWg8AcvT',
      'username': this.state.username,
      'password': this.state.password,
      'scope': '*',
      // }
    }))
    .then(response => {
      console.log(response);
      this.setState({'authenticated': true, 'accessToken': response.data.access_token})
    })
    .catch(error => {
      console.log(error);
    });
  }

  loadTournaments() {
    axios.get('https://lets-go2.herokuapp.com/api/tournaments', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.accessToken
      }
    })
    .then((response) => {
      console.log(response.data.data);
      this.setState({tournamentsLoaded: true, tournaments: response.data.data, selected: response.data.data[0].id});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  loadTournament() {
    let url = 'https://lets-go2.herokuapp.com/api/tournaments/' + this.state.selected;
    axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.accessToken
      }
    })
    .then((response) => {
      console.log(response.data);
      let teams = [];
      for(let i in response.data.teams){
        let t = response.data.teams[i];
        t.present = false;
        teams.push(t);
      }
      let tournament = {
        'date': response.data.date,
        'id': response.data.id,
        'name': response.data.name,
        'sport': response.data.sport
      }

      this.setState({'tournament': tournament, 'teams': teams});
      console.log("teams = ");
      console.log(this.state.teams);
      socket.emit('tournamentConnected', {id: tournament.id, name: tournament.name});
    })
    .catch(function (error) {
      console.log(error);
    });
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


  arbre2(){
    let participantpres=[];
    for(let i in this.state.teams){
      if(this.state.teams[i].present){
        participantpres.push(this.state.teams[i]);
      }
    }
    let nbJoueur = participantpres.length;
    let nbTour = 1;
    while(Math.pow(2,nbTour) < nbJoueur){
      nbTour++;
    }
    let nbDuel = (nbJoueur-(Math.pow(2,nbTour)-nbJoueur))/2;
    let i=0;

    let tournoi=[];

    let nbDuels=nbJoueur-1;
    //////////////CREATION DU TABLEAU ET REMPLISSAGE AVEC DES MATCHS VIDES/////////////////////
    while (i!=nbTour) {
      tournoi[i]=[];
      let nbmatchs=Math.pow(2,i);
      for(let t=0;t<nbmatchs;t++){
        if(nbDuels>0){
          tournoi[i][t]=new Match(i,t,null,null);
          nbDuels--;
        }
      }
      i++;
    }

    i--;
    ///////////////REMPLISSAGE DU TABLEAU AVEC DES EQUIPES/////////////
    while(nbJoueur>0){
      for (var t = tournoi[i].length-1; t >=0 ; t--) {
        if(nbJoueur==1){
          let n=Math.floor(Math.random() * Math.floor(participantpres.length));
          let joueur=participantpres[n];
          participantpres.splice(n,1);
          tournoi[i][t]=new Match(i,t,null,joueur);
          nbJoueur--;
        }else {
          let n1=Math.floor(Math.random() * Math.floor(participantpres.length));
          let joueur1=participantpres[n1];
          participantpres.splice(n1,1);
          let n2=Math.floor(Math.random() * Math.floor(participantpres.length));
          let joueur2=participantpres[n2];
          participantpres.splice(n2,1);
          tournoi[i][t]=new Match(i,t,joueur1,joueur2);
          nbJoueur--;
          nbJoueur--;
        }
      }
      i--;
    }
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

    this.setState({teamsLoaded:true});
    this.setState({matchs:tournoi});
    for (var r = 0; r < tournoi.length; r++) {
      for (var j = 0; j < tournoi[r].length; j++) {

        if(tournoi[r][j].j1!=null ||tournoi[r][j].j2!=null){
        this.state.matchsSuivants.push(tournoi[r][j]);
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


  reset() {
    this.setState({
      'tournamentsLoaded': false,
      'selected': 0,
      'tournament': undefined,
      'validated': false,
      'matchsSuivants':[],
      'teamsLoaded': false,
      'tournaments': [],
      'teams': [],
      'matchs': [],
      'nbTerrain': 1,
      'username': '',
      'password': '',
      'accessToken': '',
      'authenticated': true
    });
    this.loadTournaments();
  }



  render() {
    return (
      <div id="tournaments">
        <button id="reset" className="btn btn-outline-dark btn-sm"
          onClick={() => this.reset()}>reset</button>
          {this.state.authenticated ? "" :
          <Login
            username={this.state.username}
            usernameChange={(e) => this.setState({'username': e.target.value})}
            password={this.state.password}
            passwordChange={(e) => this.setState({'password': e.target.value})}
            login={() => this.login()}/>
          }
          { this.state.tournament == undefined ?
            <div id="tournamentSelectContainer">
              {this.state.tournamentsLoaded == true ?
                <div id="tournamentSelect">
                  <div className="title">
                    <h1>Tournaments</h1>
                  </div>
                  <div id="tournamentList">
                    <TournamentList
                      tournaments={this.state.tournaments}
                      // loadTournament={(id) => this.loadTournament(id)}
                      selected={this.state.selected}
                      selectTournament={(id) => this.selectTournament(id)}
                    />
                  </div>
                  <div className="bottom">
                    <button className="btn btn-warning" onClick={() => this.loadTournaments()}>Load Tournaments</button>
                    <button className="btn btn-success" onClick={() => this.loadTournament()}>Confirm & Load Tournament</button>
                  </div>
                </div>
                :
                <div id="loadingTournaments">
                  <h1>Loading Tournaments</h1>
                  <div className="progress">
                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: 100 + '%'}}></div>
                  </div>
                </div>
              }
            </div>
            :


            <div id="teamsContainer">
              <div id="teams">
                { this.state.teamsLoaded !=false ?

                  <div id="teamsInner">
                    <h1>Arborescence des matchs</h1>

                    <div id="teamsListPres" className="container-fluid">

                      <div id="tree">

                        {this.state.matchsSuivants.map(line => (
                          <div className="match" >
                              <div className="col-sm-4 card">
                                <div className="card-body">
                                  <h6>{line==null? "null" : (line.j1==null?"null":line.j1.name)}</h6>
                                  <h6>{line==null? "null" :(line.j2==null?"null":line.j2.name)}</h6>
                                  <button className="btn btn-success" onClick={() => this.jeu(line.id,line.tour,1)}>1</button>
                                  <button className="btn btn-success" onClick={() => this.jeu(line.id,line.tour,2)}>2</button>
                                </div>

                              </div>


                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                  :


                  <div id="tournamentContainer">
                    <div id="tournament">
                      {this.state.tournament != undefined ?
                        <div>
                          <h1>Selected Tournament</h1>
                          <h2>{this.state.tournament.sport} tournament</h2>
                          <h4>Date: {this.state.tournament.date}</h4>
                          <h4>Teams:</h4>
                          <TeamList teams={this.state.teams} teamPresent={(index) => this.teamPresent(index)}/>
                        </div>
                        :
                        ""
                      }
                    </div>
                    <div id="sidebar">
                      <input className="form-control" type="number" value={this.state.nbTerrain} onChange={(e) => this.setState({'nbTerrain': e.target.value})}/>
                      <ul>
                        {this.state.referees.map((referee, index) => (
                          <li key={index}>{referee}</li>
                        ))}
                      </ul>

                      <button id="start" className="btn btn-outline-danger btn-lg" onClick={() => this.arbre2()}>Start</button>
                    </div>
                  </div>



                }


              </div>
            </div>
          }



          <style jsx>{`
            #tournaments {
              display: flex;
              height: calc(100vh - 30px);
            }
            #reset {
              position: fixed;
              bottom: 0;
              left: 0;
            }
            #tournamentSelect {
              flex: 1;
              /* margin: 40px; */
              width: 100%;
              /* height: 20vh; */
              /* background: green; */
              display: flex;
              flex-direction: column;
            }
            #teamsListPres {
              height: 80vh;
              overflow-y: scroll;
            }
            #tournamentSelectContainer {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
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
            #teamsInner {
              width: 100%;
            }
            #tournamentSelect .bottom {
              margin: 10px 0;
              text-align: center;
            }
            #loadingTournaments {
              text-align: center;
              width: 50%;
              height: 50%;
              margin: 25%;
            }
            #tournamentContainer {
              width: 100%;
              display: flex;
            }
            #teamsContainer {
              width: 100%;
              display: flex;
            }
            #teams {
              width: 100%;
              display: flex;
            }
            #tournament {
              flex: 1;
              height: 100%;
              overflow: auto;
            }
            #sidebar {
              position: relative;
              padding: 10px;
              width: 320px;
              height: 100%;
              background: #ecf0f1;
              text-align: center;
            }
            #start {
              position: absolute;
              bottom: 10px;
              right: 5%;
              width: 90%;
            }
            #match {
              display: flex;
              position: relative;
              background: #ecf0f1;
              text-align: center;
            }
            #m1 {
              display: flex;
              text-align: center;
            }
            #m2 {
              display: flex;
              text-align: center;
            }
            `}</style>
          </div>
        );
      }
    }
