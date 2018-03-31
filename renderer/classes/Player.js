export default class Team {
  constructor(t) {
    this.id = t.id;
    this.firstName = t.firstName;
    this.lastName = t.lastName;
    this.present = false;
  }

  name() {
    return this.firstName + ' ' + this.lastName;
  }
}
