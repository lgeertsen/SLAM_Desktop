import React from 'react';

export default class Game extends React.Component {
  constructor(props) {
    super(props);



    this.state = {
      expanded: false
    }
  }

  getClass() {
    let c = "card text-center";
    switch (this.props.game.status) {
      case "waiting":
        c += " border-warning";
        break;
      case "playing":
        c += " border-danger";
        break;
      case "finished":
        c += " border-success";
        break;
    }
    return c;
  }

  render() {
    return (
      <div id="game" className="col-sm-4">
        <div className={this.getClass()}>
          <div className="card-header bg-transparent" onClick={() => this.setState({expanded: !this.state.expanded})}>
            <h6>
              {this.props.game.joueur1 ?
                <span>
                  {this.props.game.winner ?
                    <span className={this.props.game.winner == 1 ? 'text-success' : 'text-danger'}>
                      {this.props.game.joueur1.lastName}
                    </span>
                  :
                    this.props.game.joueur1.lastName
                  }
                </span>
              : '...'}
              <span> VS </span>
              {this.props.game.joueur2 ?
                <span>
                  {this.props.game.winner ?
                    <span className={this.props.game.winner == 2 ? 'text-success' : 'text-danger'}>
                      {this.props.game.joueur2.lastName}
                    </span>
                  :
                    this.props.game.joueur2.lastName
                  }
                </span>
              : '...'}
            </h6>
          </div>

          {this.state.expanded ?
            <div className="card-body">
              {this.props.game.joueur1 ?
                <div>
                  <h6>{this.props.game.joueur1.name()} ({this.props.game.joueur1.elo})</h6>
                  <h4>VS</h4>
                  {this.props.game.joueur2 ?
                    <h6>{this.props.game.joueur2.name()} ({this.props.game.joueur2.elo})</h6>
                    :
                    <h6>...</h6>
                  }
                </div>
                :
                <div>
                  <h6>...</h6>
                  <h4>VS</h4>
                  {this.props.game.joueur2 ?
                    <h6>{this.props.game.joueur2.name()} ({this.props.game.joueur2.elo})</h6>
                    :
                    <h6>...</h6>
                  }
                </div>
              }
            </div>
            :
            ''
          }
          {this.props.game.status == "playing" ?
            <div className="card-footer bg-transparent" onClick={() => this.setState({expanded: !this.state.expanded})}>
              <h6>Terrain {this.props.game.terrain}</h6>
            </div>
            :
            ''
          }
        </div>


      <style jsx>{`
        .card {
          padding: 0;
          margin-bottom: 15px;
          box-shadow: 0 2px 1px rgba(200,200,200,0.7);
        }
        .card-header,
        .card-footer {
          cursor: pointer;
        }
        .card-header h6,
        .card-footer h6 {
          margin-bottom: 0;
        }
        `}</style>
      </div>
    );
  }
}
