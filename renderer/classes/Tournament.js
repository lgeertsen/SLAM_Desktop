import Helper from '../classes/Helper';
import Match from '../classes/Match';

var helper = new Helper();

export default class Tournament {
  constructor() {
    this._teams = null;
    this._tree = null;
    this._waitingList = [];
    this._terrains = [];
    this._referees = [];
    this._history = [];
    this.socket = null;
  }

  get teams() { return this._teams; }
  set teams(teams) { this._teams = teams; }

  get tree() { return this._tree; }
  set tree(tree) { this._tree = tree; }

  get terrains() { return this._terrains; }
  set terrains(terrains) { this._terrains = terrains; }

  reset() {
    this._teams = null;
    this._tree = null;
    this._waitingList = [];
    this._terrains = [];
  }

  createTree(n, callback) {
    let tour = 0;
    let match = 0;
    let maxMatch = 1;
    let tree = [[]];

    for(let i = 0; i < n; i++) {
      let game = new Match(match, tour);
      tree[tour][match] = game;
      match++;

      if(match == maxMatch && i != n-1) {
        tour++;
        tree[tour] = [];
        maxMatch *= 2;
        match = 0;
      }
    }
    this._tree = tree;
    callback({tree: tree});
  }

  fillTree(joueurs, callback) {
    let players = this.shuffle(joueurs);
    this.assignPlayersToGame(players, callback);
  }

  shuffle(joueurs) {
    var l = joueurs.length;
    for(var i = 0; i < l; i++) {
      var index = helper.random(0, l);
      var j = joueurs[i];
      joueurs[i] = joueurs[index];
      joueurs[index] = j;
    }
    return joueurs;
  }

  assignPlayersToGame(players, callback) {
    let game = 0;
    let round = this._tree.length - 1;
    let i = 0;
    while(i < players.length) {
      let match = this._tree[round][game];
      if(match.joueur1 == null) {
        match.joueur1 = players[i];
        i++;
      } else if(match.joueur2 == null) {
        match.joueur2 = players[i];
        match.status = "waiting";
        i++;
        this._waitingList.push(match);
      } else {
        game++;
        if(game == this._tree[round].length) {
          game = 0;
          round--;
        }
      }
    }
    callback({tree: this._tree});
  }

  assignPlayerToGame(player, round, id) {
    let assigned = false;
    let i = 0;
    let game = Math.trunc(id/2);
    if(round == this._tree.length-2) {
      while(!assigned) {
        let match = this._tree[round][i];
        if(match.joueur1 == null) {
          match.joueur1 = player;
          assigned = true;
        } else if(match.joueur2 == null) {
          match.joueur2 = player;
          match.status = "waiting";
          this._waitingList.push(match);
          assigned = true;
        } else {
          i++
        }
      }
    } else {
      let match = this._tree[round][game];
      if(match.joueur1 == null) {
        match.joueur1 = player;
      } else if(match.joueur2 == null) {
        match.joueur2 = player;
        match.status = "waiting";
        this._waitingList.push(match);
        assigned = true;
      } else {
        console.error("Can't assign player to new game!!! :O");
      }
    }
  }

  assignTerrain(n, referees, callback) {
    this._referees = referees;
    for(let i = 0; i < n; i++) {
      let match = this._waitingList.shift();
      match.terrain = i+1;
      match.status = "playing";
      if(referees[i]) {
        match.referee = referees[i];
        this._referees[i].match = [match.tour, match.id];
        this.socket.emit("match",{id: match.referee.id, match: match});
      }
      this._terrains.push(match);
    }
    callback({terrains: this._terrains, referees: this._referees});
  }

  addPoint(match, id, callback) {
    let m = this._tree[match.tour][match.id];
    let result = m.addPoint(id);
    callback({tree: this._tree, terrains: this._terrains}, result);
  }

  finishGame(match, winner, callback) {
    let m = this._tree[match.tour][match.id];
    m.winner = winner;
    m.status = "finished";
    this._history.unshift(m);
    m.joueur1.nbparties++;
    m.joueur2.nbparties++;
    let ancienelo1 = m.joueur1.elo;
    let ancienelo2 = m.joueur2.elo;

    if(winner == 1) {
      m.joueur1.elo = Math.floor(ancienelo1 + m.joueur1.coeff()*(1-(1/(1+Math.pow(10,(-(ancienelo1 - ancienelo2)/400))))));
      m.joueur2.elo = Math.floor(ancienelo2 + m.joueur2.coeff()*(0-(1/(1+Math.pow(10,(-(ancienelo2 - ancienelo1)/400))))));
    } else {
      m.joueur1.elo = Math.floor(ancienelo1 + m.joueur1.coeff()*(0-(1/(1+Math.pow(10,(-(ancienelo1 - ancienelo2)/400))))));
      m.joueur2.elo = Math.floor(ancienelo2 + m.joueur2.coeff()*(1-(1/(1+Math.pow(10,(-(ancienelo2 - ancienelo1)/400))))));
    }

    if(match.tour == 0) {
      this._terrains = null;
      callback(this._tree, this._terrains, this._history, true);
    } else {
      if(winner == 1) {
        this.assignPlayerToGame(m.joueur1, m.tour-1, m.id);
      } else {
        this.assignPlayerToGame(m.joueur2, m.tour-1, m.id);
      }

      for(let i in this._terrains) {
        let t = this._terrains[i];
        if(t.joueur1 == m.joueur1 && t.joueur2 == m.joueur2) {
          this._terrains[i] = null;
        }
      }

      if(this._waitingList.length) {
        let newMatch = this._waitingList.shift();
        newMatch.terrain = m.terrain;
        newMatch.status = "playing";
        newMatch.referee = m.referee;

        let assigned = false;
        let i = 0;
        while(!assigned) {
          if(this._terrains[i] == null) {
            this._terrains[i] = newMatch;
            assigned = true;
          }
          i++;
        }
        // this._tables[g.table-1] = newGame;
      } else {
        this._terrains.splice(m.terrain-1, 1);
        console.log(this._terrains);
        for(let i in this._terrains) {
          if(!this._terrains[i].referee) {
            this._terrains[i].referee = m.referee;
          }
        }
      }

      callback(this._tree, this._terrains, this._history, false);

      // console.log("elo 1 : ", m.joueur1.elo, m.joueur1.coeff(), m.joueur1.nbparties);
      // console.log("elo 2 : ", m.joueur2.elo, m.joueur2.coeff(), m.joueur2.nbparties);
    }
  }

  createRanking(callback) {
    let ranking = [];
    let m = this._tree[0][0];
    if(m.winner == 1) {
      m.joueur1.rank = "Winner";
      ranking.push(m.joueur1);
      m.joueur2.rank = "Finalist";
      ranking.push(m.joueur2);
    } else {
      m.joueur2.rank = "Winner";
      ranking.push(m.joueur2);
      m.joueur1.rank = "Finalist";
      ranking.push(m.joueur1);
    }

    for(let i = 1; i < this._tree.length; i++) {
      let t = this._tree[i];
      for(let j = 0; j < t.length; j++) {
        m = t[j];
        if(m.winner == 1) {
          m.joueur2.rank = "1/" + Math.pow(2, m.tour) + " finale";
          ranking.push(m.joueur2);
        } else {
          m.joueur1.rank = "1/" + Math.pow(2, m.tour) + " finale";
          ranking.push(m.joueur1);
        }
      }
    }

    callback({ranking: ranking});
  }
}

function random(min, max) {
  return Math.floor(min + (Math.random() * (max - min)));
}
