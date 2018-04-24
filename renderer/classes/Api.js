import axios from 'axios';
import querystring from 'querystring';

import Player from '../classes/Player';

export default class Api {
  constructor(){

  }

  login(username, password, callback) {
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
      callback({'authenticated': true, 'accessToken': response.data.access_token});
      // this.setState({'authenticated': true, 'accessToken': response.data.access_token})
    })
    .catch(error => {
      console.log(error);
    });
  }

  loadTournaments(token, callback) {
    axios.get('https://lets-go2.herokuapp.com/api/tournaments', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => {
      console.log(response.data.data);
      callback({tournamentsLoaded: true, tournaments: response.data.data, selected: response.data.data[0].id});
      // this.setState({tournamentsLoaded: true, tournaments: response.data.data, selected: response.data.data[0].id});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  loadTournament(selected, token, socket, callback) {
    let url = 'https://lets-go2.herokuapp.com/api/tournaments/' + selected;
    axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => {
      console.log(response.data);
      let teams = [];
      console.log(response.data.teams);
      for(let i in response.data.teams){
        let t = new Player(response.data.teams[i]);
        // t.present = false;
        teams.push(t);
      }
      let tournament = {
        'date': response.data.date,
        'id': response.data.id,
        'name': response.data.name,
        'sport': response.data.sport
      }
      // this.setState({'tournament': tournament, 'teams': teams});
      socket.emit('tournamentConnected', {id: tournament.id, name: tournament.name});
      callback({'tournament': tournament, 'teams': teams})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  sendResults(id, token, results) {
    console.log("SENDING RESULTS");
    console.log(id);

    console.log(results);

    var postData = {
      results: results
    };

    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    };

    let url = 'https://lets-go2.herokuapp.com/api/tournaments/' + id;
    axios.post(url, postData, axiosConfig)

    //   {
    //   results: results
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + token
    //   }
    // })
    .then((response) => {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
