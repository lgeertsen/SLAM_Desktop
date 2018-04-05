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
          <h2>{this.props.tournament.name}</h2>
          <h4>{this.props.tournament.date}</h4>
          <hr/>
          <button className="btn btn-dark" onClick={() => this.props.allPresent()}>All Present</button>
          <hr/>
          <div className="form-group">
            <label htmlFor="nbTables"><h4>Nb terrains</h4></label>
            <select className="form-control" id="nbTables" value={this.props.nbTerrain} onChange={e => this.props.changeTerrain(e)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
          </div>
          <hr/>
          <h4>Arbitres</h4>
          <ul>
            {this.props.referees.map((referee, index) => (
              <li key={index}>{referee.name}</li>
            ))}
          </ul>
        </div>

        <button id="start" className="btn btn-outline-danger btn-lg" onClick={() => this.props.start()}>Start</button>


        <style jsx>{`
          #sidebar {
            position: relative;
            padding: 10px;
            width: 300px;
            height: 100%;
            background: #ecf0f1;
            text-align: center;
            display: flex;
            flex-direction: column;
          }
          #sidebarInner {
            flex-grow: 1;
          }
          .btn {
            width: 95%;
          }
          .form-group {
            display: flex;
          }
          label, select {
            display: inline-block;
            width: auto;
          }
          label {
            flex: 1;
            margin-top: 5px;
          }
          `}</style>
        </div>
      );
    }
  }
