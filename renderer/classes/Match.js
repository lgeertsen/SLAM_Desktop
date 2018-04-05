export default class Match {
  constructor(id,tour){
    this.id = id;
    this.tour = tour;
    this._joueur1 = null;
    this._joueur2 = null;
    this._status = "empty";
    this._winner = null;
    this._sets = [new Set()];
    this.score = [0, 0];
    // match = [{winner: 1, sets: [set, set, set] }];
    // set = [{winner: 1, gams: [game, game, game, ...] }];
    // game = [{winner: 1, score: [40, 15] }];
  }

  get joueur1() { return this._joueur1; }
  set joueur1(joueur1) { this._joueur1 = joueur1; }

  get joueur2() { return this._joueur2; }
  set joueur2(joueur2) { this._joueur2 = joueur2; }

  get status() { return this._status; }
  set status(status) { this._status = status; }

  get sets() { return this._sets; }
  set sets(sets) { this._sets = sets; }

  gagne() { return this._result1 > this._result2; } //true si J1 gagne le match false sinon

  addPoint(id) {
    let set = this._sets[this._sets.length-1];
    let score = set.addPoint(id);
    if(score == "GAME") {
      this.score = [0, 0];
      if(set.winner == id) {
        let count = 0;
        for(let i in this._sets) {
          if(this._sets[i].winner == id) {
            count++;
          }
        }
        if(count == 3) {
          return id;
        }
        this._sets.push(new Set());
      }
    } else {
      this.score[id-1] = score;
    }
    return null;
  }
}

class Set {
  constructor() {
    this.winner = null;
    this.games = [new Game()];
    this.score = [0, 0];
  }

  addPoint(id) {
    let score = this.games[this.games.length-1].addPoint(id);
    if(score == "GAME") {
      this.score[id-1] += 1;
      if(this.score[id-1] == 6) {
        this.winner = id;
      }
      this.games.push(new Game());
    }
    return score;
  }
}

class Game {
  constructor() {
    this.winner = null;
    this.score = [0, 0];
  }

  addPoint(id) {
    this.score[id-1] += 1;
    if(this.score[id-1] == 4) {
      this.winner = id;
    }

    return this.getScore(id);
  }

  getScore(id) {
    let points = this.score[id-1];
    let score;
    switch (points) {
      case 0:
        score = 0;
        break;
      case 1:
        score = 15;
        break;
      case 2:
        score = 30;
        break;
      case 3:
        score = 40;
        break;
      case 4:
        score = "GAME";
        break;
    }
    return score;
  }
}
