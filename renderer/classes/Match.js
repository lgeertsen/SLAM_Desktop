export default class Match {
  constructor(id,tour){
    this.id = id;
    this.tour = tour;
    this._joueur1 = null;
    this._joueur2 = null;
    this._result1 = null;
    this._result2 = null;
    this._status = "empty";
  }

  get joueur1() { return this._joueur1; }
  set joueur1(joueur1) { this._joueur1 = joueur1; }

  get joueur2() { return this._joueur2; }
  set joueur2(joueur2) { this._joueur2 = joueur2; }

  get result1() { return this._result1; }
  set result1(result1) { this._result1 = result1; }

  get result2() { return this._result2; }
  set result2(result1) { this._result2 = result2; }

  get status() { return this._status; }
  set status(status) { this._status = status; }

  gagne() { return this._result1 > this._result2; } //true si J1 gagne le match false sinon
}
