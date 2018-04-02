import Helper from '../classes/Helper';
import Match from '../classes/Match';

var helper = new Helper();

export default class Tournament {
  constructor() {
    this._teams = null;
    this._tree = null;
    this._waitingList = [];
    this._terrains = [];
    this._history = [];
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

  assignTerrain(n, callback) {
    for(let i = 0; i < n; i++) {
      let match = this._waitingList.shift();
      match.terrain = i+1;
      match.status = "playing";
      this._terrains.push(match);
    }
    callback({terrains: this._terrains});
  }

  addPoint(match, id, callback) {
    let m = this._tree[match.tour][match.id];
    let result = m.addPoint(id);
    callback({tree: this._tree, terrains: this._terrains}, result);
  }

  finishGame(match, winner, callback) {
    if(match.round == 0) {
      // TODO: Finish tournament
      console.log("Tournament finished");
    } else {
      let m = this._tree[match.tour][match.id];
      m.winner = winner;
      m.status = "finished";
      this._history.unshift(m);
      if(winner == 1) {
        this.assignPlayerToGame(m.joueur1, m.tour-1, m.id);
      } else {
        this.assignPlayerToGame(m.joueur2, m.tour-1, m.id);
      }

      this._terrains[m.terrain-1] = null;

      if(this._waitingList.length) {
        let newMatch = this._waitingList.shift();
        newMatch.terrain = m.terrain;
        newMatch.status = "playing";

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
      }

      callback(this._tree, this._tables, this._history);
    }
  }
}

function random(min, max) {
  return Math.floor(min + (Math.random() * (max - min)));
}
