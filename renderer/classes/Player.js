export default class Team {
  constructor(t) {
    this.id = t.id;
    this.firstName = t.firstName;
    this.lastName = t.lastName;
    this.present = false;
    this.elo = 1000;
    this.nbparties = 0;
  }

  name() {
    return this.firstName + ' ' + this.lastName;
  }

  coeff(){
    if (this.nbparties <= 30) return 40;
    else if (this.elo < 2400) return 20;
    else return 10;
  }
}
