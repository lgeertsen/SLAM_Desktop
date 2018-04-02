import React from 'react';

import NowPlaying from '../containers/NowPlaying';
import Overview from '../containers/Overview';

export default class TournamentContainer extends React.Component {
  constructor(props) {
    super(props);


    this.state = {

    }
  }

  render() {
    return (
      <div id="TournamentContainer">
        {this.props.activeTab == 1 ?
          <div id="overview">
            <Overview tree={this.props.tree}/>
          </div>
          : ''
        }
        {this.props.activeTab == 2 ?
          <div id="nowPlaying">
            <NowPlaying
              terrains={this.props.terrains}
              finishGame={(game, winner) => this.props.finishGame(game, winner)}
              addPoint={(game, id) => this.props.addPoint(game, id)}
            />
          </div>
          : ''
        }
        {this.props.activeTab == 3 ?
          <div id="history">
            history
            {/* <History history={this.props.history}/> */}
          </div>
          : ''
        }
        {this.props.activeTab == 4 ?
          <div id="options">Options</div>
          : ''
        }

        <style jsx>{`
          #TournamentContainer {
            width: 100%;
            height: 100%;
            display: flex;
          }
          #tournament div {
            flex: 1 1 auto;
          }
          #overview {
            width: 100%;
            overflow-y: auto;
          }
          #nowPlaying {
            width: 100%;
            overflow-y: auto;
          }
          #history {
            width: 100%;
            overflow-y: auto;
          }
        `}</style>
      </div>
    );
  }
}
//
// <div id="teamsInner">
//     <h1>Arborescence des matchs</h1>
//     <div id="teamsListPres" className="container-fluid">
//       <div id="tree">
//         {this.state.matchsSuivants.map(line => (
//           <div className="match" >
//               <div className="col-sm-4 card">
//                 <div className="card-body">
//                   <h6>{line==null? "null" : (line.j1==null?"null":line.j1.name)}</h6>
//                   <h6>{line==null? "null" :(line.j2==null?"null":line.j2.name)}</h6>
//                   <button className="btn btn-success" onClick={() => this.jeu(line.id,line.tour,1)}>1</button>
//                   <button className="btn btn-success" onClick={() => this.jeu(line.id,line.tour,2)}>2</button>
//                 </div>
//               </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
