import React from 'react';
//import ReactTable from 'react-table'
import axios from 'axios';
import querystring from 'querystring';

const io = require('socket.io-client');

import Login from '../components/Login';
import TournamentList from '../components/TournamentList';
import TeamList from '../components/TeamList';

var socket;


export default class Match{
  constructor(id,joueur1,joueur2){
    this.id=id
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

  arbre(){
      let participantpres=[];
      for(let i in this.state.teams){
        if(this.state.teams[i].present){
          participantpres.push(this.state.teams[i]);
        }
      }
      let nbJoueur = participantpres.length;
      //let nbJeu=1;
      let nbTour = 1;
      while(Math.pow(2,nbTour) < nbJoueur){
        nbTour++;
      }
      let indice = nbTour;
      let nbDuel = (nbJoueur-(Math.pow(2,nbTour)-nbJoueur))/2;
      //let nbTerrain = this.state.nbTerrain;
      let i=0;
      let match=[];

      console.log("nbJoueur : ",nbJoueur);
      console.log("nbTour : ",nbTour);
      console.log("nbDuel : ",nbDuel);
      console.table(participantpres);

       //remplir le tableau avec les matchs ordinaires (premier match)
       while(nbDuel != 0){
         match[i]=new Array();
         let n1=Math.floor(Math.random() * Math.floor(participantpres.length));
         match[i][1] = participantpres[n1].name;
         participantpres.splice(n1,1);
         let n2=Math.floor(Math.random() * Math.floor(participantpres.length));
         match[i][2] = participantpres[n2].name;
         participantpres.splice(n2,1);
         i++;
         nbDuel--;
       }

       //remplir le tableau avec les matchs un seul joueur (premier tour)

       while((i < Math.pow(2,nbTour)) &&(participantpres.length != 0) ){
         match[i]=new Array();
         let n1=Math.floor(Math.random() * Math.floor(participantpres.length));
         match[i][1] = participantpres[n1].name;
         match[i][3] = participantpres[n1].name;
         participantpres.splice(n1,1);
         i++;

       }

       let i2=0;

       //remplir troisième ligne avec le gagnant
       //while(match[i2][3] == NULL){
       //
       //}
/*
       nbTour--;
       while(nbTour!=0){
         match[i]=new Array();
         let j=0;
         while(j < Math.pow(2,nbTour)){
           match[j][(indice-nbTour)*3] = match[j*2][(indice-nbTour)*3-1];
           match[j][(indice-nbTour)*3+1] = match[j*2+1][(indice-nbTour)*3-1];
           //remplir ligne 3
           j++;
         }
         nbTour--;
       }
*/
       console.table(participantpres);
       console.log("Matchs");
       console.table(match);

       //this.state.teamsLoaded=true;
       //this.state.matchs=match;
       this.setState({teamsLoaded:true});
       this.setState({matchs:match});
    }


  reset() {
    this.setState({
      'tournamentsLoaded': false,
      'selected': 0,
      'tournament': undefined,
      'validated': false,

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
agagne(){

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

          <div>
            <h1>Arborescence des matchs</h1>

            <div id="teamsListPres">

            <table>
              <tbody>
              {this.state.matchs.map((line) => (
                <tr>
                  {line.map((equipe) => (
                    <td>
                      <button className="btn" onClick={() => this.props.agagne()}> {equipe}</button>

                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
          </table>
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

              <button id="start" className="btn btn-outline-danger btn-lg" onClick={() => this.arbre()}>Start</button>
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
        `}</style>
      </div>
    );
  }
}
