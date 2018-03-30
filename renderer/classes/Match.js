export default class Match {
  constructor(id,tour,joueur1,joueur2){
    this.id=id;
    this.tour=tour;
    this.j1=joueur1;
    this.j2=joueur2;
    this.res1=null;
    this.res2=null;

  }

  gagne(){return this.res1>this.res2;}//true si J1 gagne le match false sinon
}
