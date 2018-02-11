import React from 'react';
import axios from 'axios';
import querystring from 'querystring';

import Login from '../components/Login';
import TournamentList from '../components/TournamentList';
import ParticipantList from '../components/ParticipantList';

export default class Tournaments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'tournament': undefined,
      'tournaments': [],
      'participants': [],
      'nbTerrain': 1,
      'username': '',
      'password': '',
      'accessToken': '',
      'authenticated': true
    }
  }

  login() {
    axios.post('https://lets-go2.herokuapp.com/oauth/token', querystring.stringify({
      // 'form_params': {
        'grant_type': 'password',
        'client_id': 61,
        'client_secret': 'Gy8l6blIkFUcSbkMmnEj3wnlfbNGmU90lDpEMMDR',
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
      this.setState({'tournaments': response.data.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  loadTournament(id) {
    let url = 'https://lets-go2.herokuapp.com/api/tournaments/' + id;
    axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.accessToken
      }
    })
    .then((response) => {
      console.log(response.data);
      let participants = [];
      for(let i in response.data.participants){
        let p = response.data.participants[i];
        p.present = false;
        participants.push(p);
      }
      this.setState({'tournament': response.data, 'participants': participants});
      console.log("participants = ");
      console.log(this.state.participants);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  participantPresent(index) {
    let participant=this.state.participants;
    let p = participant[index].present;
    participant[index].present = !p;
    this.setState({'participants': participant})
    console.log(this.state.participants[0]);
  }

  // arbre(){
  //   let participantpres=[];
  //   for(let i in participants){
  //     if(participants[i].present){
  //       participantpres.push(participants[i]);
  //     }
  //   }
  //   let nbJeu=0;
  //   nbJeu = participantpres.length-1;
  //
  //   let nbTerrain = this.state.nbTerrain;
  //
  //   let i=0;
  //   while(i < nbTerrain)
  // }



  render() {
    return (
      <div id="tournaments">
        {this.state.authenticated ? "" :
          <Login
            username={this.state.username}
            usernameChange={(e) => this.setState({'username': e.target.value})}
            password={this.state.password}
            passwordChange={(e) => this.setState({'password': e.target.value})}
            login={() => this.login()}/>
        }
        <div id="tournamentContainer">
          {this.state.tournament != undefined ?
            <div>
              <h1>Selected Tournament</h1>
              <h2>{this.state.tournament.sport} tournament</h2>
              <h4>Date: {this.state.tournament.date}</h4>
              <h4>Participants:</h4>
              <ParticipantList participants={this.state.participants} participantPresent={(index) => this.participantPresent(index)}/>
            </div>
            :
            ""
          }
        </div>
        <div id="tournamentListContainer">
          <button className="btn btn-warning" onClick={() => this.loadTournaments()}>Load Tournaments</button>
          <TournamentList tournaments={this.state.tournaments} loadTournament={(id) => this.loadTournament(id)}/>
          <input className="form-control" type="number" value={this.state.nbTerrain} onChange={(e) => this.setState({'nbTerrain': e.target.value})}/>
          <button id="start" className="btn btn-outline-danger btn-lg" onClick={() => this.props.arbre()}>Start</button>
        </div>


        <style jsx>{`
          #tournaments {
            display: flex;
            height: calc(100vh - 30px);
          }
          #tournamentContainer {
            flex: 1;
            height: 100%;
            overflow: auto;
          }
          #tournamentListContainer {
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
