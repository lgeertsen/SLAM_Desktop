export default class Helper {
  constructor() {

  }

  random(min, max) {
    return Math.floor(min + (Math.random() * (max - min)));
  }
}
