import React from 'react';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <div id="sidebar">
        <div id="sidebarInner">
          <button className="btn btn-warning" onClick={() => this.props.allPresent()}>All Present</button>
          <hr/>
          <input className="form-control" type="number" value={this.props.nbTerrain} onChange={(e) => this.props.changeTerrain(e)}/>
          <ul>
            {this.props.referees.map((referee, index) => (
              <li key={index}>{referee}</li>
            ))}
          </ul>
        </div>

        <button id="start" className="btn btn-outline-danger btn-lg" onClick={() => this.props.arbre()}>Start</button>


        <style jsx>{`
          #sidebar {
            position: relative;
            padding: 10px;
            width: 250px;
            height: 100%;
            background: #ecf0f1;
            text-align: center;
            display: flex;
            flex-direction: column;
          }
          #sidebarInner {
            flex-grow: 1;
          }
          `}</style>
        </div>
      );
    }
  }
