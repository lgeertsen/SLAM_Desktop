import React from 'react';

export default class TournamentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  cards() {
    let cards = [];
    // for(let i = 0; i < this.props.tournaments.length; i++) {
    //   var tournament = this.props.tournaments[i];
    cards.push(this.props.tournaments.map((tournament, index) => {
      // cards.push(
        return <div key={tournament.id} className={this.props.selected == tournament.id ? "card col-sm-4 selected" : "card col-sm-4"}>
          <div className="card-body">
            <h5 className="card-title">{ tournament.name }</h5>
            <h6 className="card-subtitle mb-2 text-muted">{ tournament.sport }</h6>
            <h6>{ tournament.date }</h6>

          </div>
          <div className="card-footer">
            {this.props.selected == tournament.id ?
              <a className="btn btn-outline-danger btn-sm disabled">
                Selected
              </a>
              :
              <a className="btn btn-outline-success btn-sm"
                 onClick={() => this.props.selectTournament(tournament.id)}
              >Select</a>
            }
          </div>
          <style jsx>{`
            .card.col-sm-4 {
              padding: 0;
            }
            .selected {
              border-color: #dc3545;
            }
            .card-footer {
              text-align: center;
            }
            `}</style>
        </div>
      }))
    return cards;
  }

  cardDecks() {
    var cardDecks = [];
    var cards = this.cards();

    for(var i = 0; i < cards[0].length; i+=3) {
      var row = [];
      row.push(cards[0].slice(i, i+3).map(card => {
        return card;
      }))
      cardDecks.push(row.map(item => {
        return <div className="card-deck row justify-content-md-center">
          {item}
          <style jsx>{`
            .card-deck.row {
              margin: 10px 0;
            }
            `}</style>
        </div>
      }))
    }
    return cardDecks;
  }

  render() {
    return (
      <div id="tournamentList">
        <div className="container-fluid">
          {this.cardDecks()}
        </div>


        <style jsx>{`
          #tournamentList {
            /* margin: 10px 0; */
            text-align: left;
            height: 100%;
            /* height: 60vh; */
            overflow-y: scroll;
          }
          .list-group {
            height: 100%;
            /* overflow-y: auto; */
          }
          button {
            float: right;
          }
          `}</style>
        </div>
      );
    }
  }
